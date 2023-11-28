import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import configuration from '../config/configuration';
import { FileUploadModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { AttractionModule } from './attraction/attraction.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { FakerModule } from './faker/faker.module';
import { SearchModule } from './search/search.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`],
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        sortSchema: true,
        playground: process.env.NODE_ENV ? false : true,
        autoSchemaFile: join(process.cwd(), `${configService.get('graphql.autoSchemaFile')}`),
      }),
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
