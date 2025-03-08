import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'libs/config/src';
import axios from 'axios';

@Injectable()
export class FacebookAuthService {
  private clientID: string;
  private clientSecret: string;
  private callbackURL: string;

  constructor(private appConfigService: AppConfigService) {
    const facebookConfig = appConfigService.getFacebookConfig();
    this.clientID = facebookConfig.clientID;
    this.clientSecret = facebookConfig.clientSecret;
    this.callbackURL = facebookConfig.callbackURL;
  }

  getFacebookAuthURL(state?: string): string {
    const scopes = ['email', 'public_profile'];
    const authURL = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.callbackURL)}&scope=${scopes.join(',')}&state=${state}`;
    return authURL;
  }

  async getTokens(code: string): Promise<{ accessToken: string; user: any }> {
    // Exchange code for access token
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v17.0/oauth/access_token`,
      {
        params: {
          client_id: this.clientID,
          client_secret: this.clientSecret,
          redirect_uri: this.callbackURL,
          code,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Get user profile
    const userRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    return { accessToken, user: userRes.data };
  }
}
