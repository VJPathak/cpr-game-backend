import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    switch (exception.code) {
      case 11000:
        return response.status(400).json({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: 'Duplicate data',
        });
      default:
        return exception;
    }
  }
}
