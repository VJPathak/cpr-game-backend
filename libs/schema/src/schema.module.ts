import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  User,
  UserSchema,
  UserToken,
  UserTokenSchema,
} from './schema';
import { AppConfigModule, AppConfigService } from 'libs/config/src';

@Global()
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) =>
        configService.getMongoConfig(),
    }),
  ],
  providers: [],
  exports: [],
})
export class SchemaModule {
  constructor(private appConfigService: AppConfigService) {
    const environment = this.appConfigService.getNodeENV();
    if (['TESTNET', 'DEVELOPMENT', 'DEV'].includes(environment.nodeEnv)) {
      mongoose.set('debug', true);
    }
  }
}

export const DBSchemas = {
  user: MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ]),
  usertoken: MongooseModule.forFeature([
    { name: UserToken.name, schema: UserTokenSchema },
  ]),
};
