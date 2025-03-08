// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { CommonUtilsService } from 'libs/common-utils/src';
import { AppConfigService } from 'libs/config/src';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = [
  // 'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor(private appConfigService: AppConfigService) {
    const googleConfig = appConfigService.getGoogleConfig();

    this.oauth2Client = new OAuth2Client(
      googleConfig.clientID,
      googleConfig.clientSecret,
      googleConfig.callbackURL,
    );
  }

  getClient() {
    return this.oauth2Client;
  }

  getGoogleAuthURL(state?: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Get a refresh token
      prompt: 'consent', // Force re-consent to ensure a refresh token is provided
      scope: SCOPES,
      state,
    });
  }

  async verifyIdToken(idToken: string): Promise<any> {
    const googleConfig = this.appConfigService.getGoogleConfig();

    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: googleConfig.clientID, // Ensure the token is for your app
    });

    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    };
  }

  async getTokens(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; idToken: string }> {
    const { tokens } = await this.oauth2Client.getToken(code); // Exchange code for tokens
    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      idToken: tokens.id_token!,
    };
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const newTokens = await this.oauth2Client.getAccessToken();
    if (!newTokens || !newTokens.token) {
      throw new Error('Failed to refresh access token.');
    }
    return newTokens.token;
  }

  async getNewAccesssToken(refreshToken: string): Promise<string> {
    const descryptRefreshToken = CommonUtilsService.decrypt(refreshToken);
    const accessToken = await this.refreshAccessToken(descryptRefreshToken);
    return accessToken;
  }
}
