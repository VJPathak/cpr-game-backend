import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class IUserUpdateRequest {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  showeRecurringMeet?: string;
}

export class IUserBillingRequest {
  @IsArray()
  emails: string[];

  @IsString()
  timePeriod: string;
}
