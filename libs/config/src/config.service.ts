import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  public async getMongoConfig() {
    const user = this.configService.get('MONGO_USER');
    const password = this.configService.get('MONGO_PASSWORD');
    const host = this.configService.get('MONGO_HOST');
    const db = this.configService.get('MONGO_DATABASE');
    const result = {
      uri: `mongodb+srv://${user}:${password}@${host}/${db}?retryWrites=true&w=majority`,
    };
    return result;
  }

  public getNodeENV() {
    return {
      nodeEnv: this.configService.get('NODE_ENV'),
    };
  }

  public getJWTConfig() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: 3600,
    };
  }

  public getGoogleConfig() {
    return {
      appUrl: this.configService.get('APP_URI'),
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    };
  }

  getFacebookConfig() {
    return {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      appUrl: process.env.APP_URL,
    };
  }
}
