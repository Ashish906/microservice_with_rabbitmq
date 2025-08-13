import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new BadRequestException('Token not provided!');
    }
    let payload = null;
    try {
      payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.REFRESH_JWT_SECRET
        }
      );
    } catch {
      throw new BadRequestException();
    }
    const user = await this.userModel.findOne({
        _id: payload.sub,
        is_active: true
    });
    if(!user) {
      throw new BadRequestException();
    }

    request['user'] = { ...payload, ...user };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
