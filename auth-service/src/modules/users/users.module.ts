import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './models/user.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([
      UserModel
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
