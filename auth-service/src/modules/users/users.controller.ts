import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user_created')
  async handleUserCreatedEvent(data: any) {
    console.log(`Welcome ${data.email}, your account has been created successfully!`);
  }
}
