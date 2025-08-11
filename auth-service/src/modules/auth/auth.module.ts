import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from '../users/models/user.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([
      UserModel
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE,
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class AuthModule {}
