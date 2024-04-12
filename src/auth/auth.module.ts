import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { QUEUE_NAME_SEND_EMAIL } from '@/common/constant/queue.constant';
import { User, UserSchema } from '@/user/schema/user.schema';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailConsumer } from './consumers/email.consumer';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    JwtModule.registerAsync({
      useFactory() {
        return { secret: process.env.JWT_SECRET };
      },
      global: true,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME_SEND_EMAIL,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAME_SEND_EMAIL,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailConsumer],
})
export class AuthModule {}
