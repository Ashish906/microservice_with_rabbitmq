import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserClientModule } from '../rabbit-queues/user-client.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      User
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE,
      }
    }),
    UserClientModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class AuthModule {}
