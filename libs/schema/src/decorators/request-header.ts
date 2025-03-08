import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    try {
      // extract headers
      const headers = ctx.switchToHttp().getRequest().headers;

      // Convert headers to DTO object
      const dto = plainToInstance(value, headers, {
        excludeExtraneousValues: true,
      });

      // Validate
      await validateOrReject(dto);
      return dto;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  },
);
