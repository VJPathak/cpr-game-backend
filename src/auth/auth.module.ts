import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DBSchemas } from 'libs/schema/src';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'libs/config/src';
import { JwtTokenService } from './jwt-token.service';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleAuthService } from './google-auth.service';

// 
import { FacebookAuthService } from './facebook-auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => {
        const config = await configService.getJWTConfig();
        return {
          secret: config.secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    DBSchemas.user,
    DBSchemas.usertoken,
    // forwardRef(() => EventsModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleCalendarService,
    JwtTokenService,
    GoogleAuthService,
    FacebookAuthService
  ],
  exports: [JwtTokenService, GoogleAuthService, GoogleCalendarService, FacebookAuthService],
})
export class AuthModule {}
