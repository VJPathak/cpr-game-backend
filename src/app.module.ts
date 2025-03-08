import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UsersModule } from './users/user.module';
import { CommonUtilsModule } from 'libs/common-utils/src';
import { ScheduleModule } from '@nestjs/schedule';
import { SchemaModule } from 'libs/schema/src';
import { JwtAuthMiddleware } from './auth/jwt-auth.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/(.*)'],
    }),
    SchemaModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CommonUtilsModule,
  ],
  controllers: [],
  providers: [JwtAuthMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude('auth/google', 'auth/google/callback') // Exclude routes that don't require authentication
      .forRoutes('*'); // Apply globally or specify routes
  }
}
