import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AppConfigService } from 'libs/config/src';
import { JwtTokenService } from './jwt-token.service';

//
import { FacebookAuthService } from './facebook-auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private appConfigService: AppConfigService,
    private tokenService: JwtTokenService,
    private readonly authService: AuthService,
    //
    private readonly facebookAuthService: FacebookAuthService,
  ) {}

  @Get('google')
  async googleLogin(@Res() res) {
    const url = this.authService.getGoogleAuthURL();
    res.redirect(url); // Redirect to Google's OAuth2 login page
  }

  // @Get('google/link-account')
  // async linkAccount(@Req() req) {
  //   const authHeader = req.headers['authorization'];
  //   const url = this.authService.getGoogleAuthURL(authHeader);
  //   return { url };
  // }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res,
  ) {
    const googleConfig = this.appConfigService.getGoogleConfig();
    let loggedInUser = null;
    if (state && state.startsWith('Bearer ')) {
      const token = state.split(' ')[1];
      loggedInUser = await this.tokenService.validateToken(token);
    }
    let result = null;
    if (loggedInUser) {
      result = await this.authService.googleCallback(code, loggedInUser);
    } else {
      result = await this.authService.googleCallback(code);
    }

    res.redirect(
      `${googleConfig.appUrl}?token=${result.jwtToken}&type=${result.type}`,
    );
  }

  @Get('facebook')
  async facebookLogin(@Res() res) {
    console.log("Route Called...")
    const url = this.facebookAuthService.getFacebookAuthURL();
    res.redirect(url);
  }

  @Get('facebook/callback')
  async facebookCallback(@Req() req, @Query('code') code: string, @Query('state') state: string, @Res() res) {
  
   console.log("Headers:", req.headers);
   console.log("State:", state);
   
    const facebookConfig = this.appConfigService.getFacebookConfig();
    let loggedInUser = null;
    if (state && state.startsWith('Bearer ')) {
      const token = state.split(' ')[1];
      loggedInUser = await this.tokenService.validateToken(token);
    }

    const result = await this.authService.facebookCallback(code, loggedInUser);
    res.redirect(`${facebookConfig.appUrl}?token=${result.jwtToken}&type=${result.type}`);
  }
}
