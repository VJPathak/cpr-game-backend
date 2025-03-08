import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ErrorLoggingInterceptor } from './error-logging-interceptor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = new ConfigService();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.useGlobalInterceptors(new ErrorLoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('cpr-game')
    .setDescription('The cpr-game API description')
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    customCss: `
    .swagger-ui .info {
      margin: 5px 0;
    }
    .swagger-ui .scheme-container {
      margin: 0 0 5px;
      padding: 5px 0;
    }    
    `,
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: false,
    },
    customSiteTitle: 'cpr-game',
  };

  SwaggerModule.setup('swagger-api', app, document, customOptions);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`http://localhost:${port}/swagger-api`);
}
bootstrap();
