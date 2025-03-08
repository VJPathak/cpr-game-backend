import { Controller, Get, Patch, Req, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { IUserBillingRequest, IUserUpdateRequest } from './dto/user';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('me')
  async me(@Req() req): Promise<any> {
    const userId = req.user.id;
    return await this.appService.me(userId);
  }

  // @Get('linked-account')
  // async getUserTokensByUserID(@Req() req): Promise<any> {
  //   const userId = req.user.id;
  //   return await this.appService.linkedAccount(userId);
  // }

  // @Patch('delink-account:/id')
  // async deactivateUserToken(@Param('id') id: string, @Req() req) {
  //   const userId = req.user.id;
  //   const email = req.user.email;
  //   return await this.appService.delinkAccount(userId, email, id);
  // }

  @Post('save')
  async save(@Body() body: IUserUpdateRequest, @Req() req) {
    const userId = req.user.id;
    return await this.appService.updatePersonalInfo(userId, body);
  }

  // @Post('auto-sync')
  // async saveAutoSync(@Body() body: IUserBillingRequest, @Req() req) {
  //   const userId = req.user.id;
  //   return await this.appService.saveAutoSync(userId, body);
  // }
}
