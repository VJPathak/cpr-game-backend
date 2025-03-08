import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

export enum UserRoles {
  Administrator = 'administrator',
  User = 'user',
  Broker = 'broker',
}

export type ID = Types.ObjectId;

export class SearchParamsDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 1000000000000000;

  @IsOptional()
  @IsString()
  search?: string;
}

export class JwtUserPayload {
  email: string;
  id: string;
  googleId: string;
}
