import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserToken } from 'libs/schema/src';
import { IUserBillingRequest, IUserUpdateRequest } from './dto/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserToken') private readonly userTokenModel: Model<UserToken>,
    @InjectModel('User') private readonly userModel: Model<User>,
    // @InjectModel('Sync') private readonly syncModel: Model<Sync>,
  ) {}

  async me(userID: string) {
    try {
      const user = await this.userModel.findById(userID).lean();

      return { data: user };
    } catch (error) {
      throw new Error('Could not retrieve user tokens');
    }
  }

  async linkedAccount(userID: string) {
    try {
      const userTokens = await this.userTokenModel
        .find({ userID, isActive: true })
        .exec();
      if (userTokens.length == 0) {
        const resObj = {
          message: 'Collection Seems To Be Empty',
        };
        return resObj;
      }

      const extractedData = userTokens.map((item) => ({
        userID: item.userID,
        emailID: item.emailID,
        source: item.source,
        isActive: item.isActive,
        _id: item._id,
      }));

      return { data: extractedData };
    } catch (error) {
      throw new Error('Could not retrieve user tokens');
    }
  }

  async delinkAccount(userId: string, email: string, id: string): Promise<any> {
    const result = await this.userTokenModel.findById(id);
    if (!result) {
      throw new BadRequestException(`No data found.`);
    }
    if (result.userID !== userId) {
      throw new BadRequestException(`Unauthorized access.`);
    }

    if (result.emailID === email) {
      throw new BadRequestException(`Cannot delink primary account.`);
    }

    await this.userTokenModel.findByIdAndDelete(id);

    return {
      message: 'Account delinked successfully',
    };
  }

  // async saveAutoSync(userID: string, body: IUserBillingRequest): Promise<any> {
  //   try {
  //     await this.syncModel.findOneAndUpdate(
  //       { userId: userID },
  //       {
  //         emails: body.emails,
  //         userId: userID,
  //         timePeriod: body.timePeriod,
  //         autoSync: true,
  //         autoSyncStartDate: Date.now(),
  //         lastSyncedAt: null,
  //       },
  //       { upsert: true },
  //     );
  //     return {
  //       message: 'User Data Updated Successfully',
  //     };
  //   } catch (error) {
  //     throw new Error('Could not update user data');
  //   }
  // }

  async updatePersonalInfo(
    userID: string,
    body: IUserUpdateRequest,
  ): Promise<any> {
    try {
      await this.userModel.findByIdAndUpdate(userID, {
        $set: body,
      });

      return {
        message: 'User Data Updated Successfully',
      };
    } catch (error) {
      throw new Error('Could not update user data');
    }
  }
}
