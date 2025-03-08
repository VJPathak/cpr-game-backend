import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DBSchemas } from 'libs/schema/src';

@Module({
  imports: [
    DBSchemas.user,
    DBSchemas.usertoken,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
