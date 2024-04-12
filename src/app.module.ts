import { join } from 'path';

import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttractionModule } from './attraction/attraction.module';
import { AuthModule } from './auth/auth.module';
import { FakerModule } from './faker/faker.module';
import { FileUploadModule } from './file/file.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ReviewModule } from './review/review.module';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env${process.env.NODE_ENV === 'production' ? '' : '.development'}`],
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('database.host')}:${configService.get(
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        sortSchema: true,
        playground: process.env.NODE_ENV === 'production' ? false : true,
        autoSchemaFile: join(process.cwd(), `${configService.get('graphql.autoSchemaFile')}`),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'send-email',
    }),
    BullBoardModule.forRoot({
      route: '/bull-board',
      adapter: ExpressAdapter,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        },
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    UserModule,
    AuthModule,
    AttractionModule,
    RestaurantModule,
    FileUploadModule,
    ReviewModule,
    FakerModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
