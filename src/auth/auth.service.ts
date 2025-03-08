// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserToken, Source, JwtUserPayload } from 'libs/schema/src';
import { CommonUtilsService } from 'libs/common-utils/src';
import { JwtTokenService } from './jwt-token.service';
import { GoogleAuthService } from './google-auth.service';
// import { EventService } from 'src/events/events.service';

//
import { FacebookAuthService } from './facebook-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private tokenService: JwtTokenService,
    //
    private facebookAuthService: FacebookAuthService,
    // private eventService: EventService,
    @InjectModel('UserToken') private readonly userTokenModel: Model<UserToken>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  getGoogleAuthURL(token?: string): string {
    return this.googleAuthService.getGoogleAuthURL(token);
  }

  async googleCallback(code: string, loggedInUser: JwtUserPayload = null) {
    const tokens = await this.googleAuthService.getTokens(code);
    const user = await this.googleAuthService.verifyIdToken(tokens.idToken);

    let existingUser = null;
    if (loggedInUser) {
      existingUser = await this.userModel.findById(loggedInUser.id).lean();
    } else {
      existingUser = await this.userModel
        .findOne({ emailID: user.email })
        .lean();
    }

    const isExistingsUser = !!existingUser;
    if (!existingUser) {
      existingUser = await this.userModel.create({
        emailID: user.email,
        firstname: user.name.split(' ')[0] || '',
        lastname: user.name.split(' ')[1] || '',
        image: user.picture || '',
      });
    }
    // Save user token if not exists
    await this.userTokenModel.findOneAndUpdate(
      { emailID: user.email, source: Source.Google },
      {
        userID: existingUser._id.toString(),
        emailID: user.email,
        accessToken: CommonUtilsService.encrypt(tokens.accessToken),
        refreshToken: CommonUtilsService.encrypt(tokens.refreshToken),
        source: Source.Google,
      },
      { upsert: true },
    );

    const jwtToken = await this.tokenService.generateToken({
      ...user,
      _id: existingUser._id.toString(),
    });

    // if (!isExistingsUser) {
    //   const userToken = await this.userTokenModel
    //     .findOne({ emailID: user.email, source: Source.Google })
    //     .lean();
    //   this.eventService.fetchEvents(userToken, 365); // TODO: 12-15 months
    // }

    return {
      jwtToken,
      type: loggedInUser
        ? 'linked-account'
        : isExistingsUser
          ? 'old-account'
          : 'new-account',
    };
  }



  async facebookCallback(code: string, loggedInUser: JwtUserPayload = null) {
    const { accessToken, user } = await this.facebookAuthService.getTokens(code);

    let existingUser = loggedInUser
      ? await this.userModel.findById(loggedInUser.id).lean()
      : await this.userModel.findOne({ emailID: user.email }).lean();

    if (!existingUser) {
      existingUser = await this.userModel.create({
        emailID: user.email,
        firstname: user.name.split(' ')[0] || '',
        lastname: user.name.split(' ')[1] || '',
        image: user.picture.data.url || '',
      });
    }

    await this.userTokenModel.findOneAndUpdate(
      { emailID: user.email, source: Source.Facebook },
      {
        userID: existingUser._id.toString(),
        emailID: user.email,
        accessToken,
        source: Source.Facebook,
      },
      { upsert: true }
    );

    const jwtToken = await this.tokenService.generateToken({
      ...user,
      _id: existingUser._id.toString(),
    });

    return {
      jwtToken,
      type: loggedInUser ? 'linked-account' : existingUser ? 'old-account' : 'new-account',
    };
  }
}

