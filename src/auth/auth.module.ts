import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/user/schema/user.schema';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { EmailConsumer } from './consumers/email.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME_SEND_EMAIL } from '@/common/constant/queue.constant';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

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
