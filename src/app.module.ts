import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { UserModule } from './user/user.module';
import { AttractionModule } from './attraction/attraction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.NODE_ENV
          ? process.env.DATABASE_CONNECTION_URI
          : `mongodb://${configService.get('database.host')}:${configService.get(
              'database.port'
            )}/${configService.get('database.name')}`,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    UserModule,
    AttractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
