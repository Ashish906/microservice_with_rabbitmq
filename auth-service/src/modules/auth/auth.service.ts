import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private userEntityModel: ReturnModelType<typeof User>,

    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy, // Assuming this is a client proxy for user service
  ) {}


  async login(body: LoginDto) {
    const user = await this.userEntityModel.findOne({
        email: body.email,
        is_active: true
    }).select('+password');
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const { access_token, refresh_token } = await this.getTokens(user);

    return {
      message: 'Login successful',
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async register(body: RegisterDto) {
    const existingUser = await this.userEntityModel.findOne({
        email: body.email
    });
    if(existingUser) {
      throw new HttpException('User already exists', HttpStatus.AMBIGUOUS);
    }

    body.password = await bcrypt.hash(body.password, 10);
    const newUser = await this.userEntityModel.create(body);

    delete newUser.password;

    this.userServiceClient.emit('user_created', newUser);

    return {
      message: 'User registered successfully',
      data: newUser
    };
  }

  async refreshToken(payload: any) {
    const { access_token, refresh_token } = await this.getTokens(payload);

    return {
      message: 'Tokens refreshed successfully',
      data: {
        access_token,
        refresh_token
      }
    }
  }

  async getTokens(user: User) {
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE
    });

    const refreshToken = await this.jwtService.signAsync({ sub: user._id }, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async validateToken(token: string) {
    if (!token) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Token not provided!'
      });
    }
    let payload = null;
    try {
      payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );
    } catch {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token!'
      });
    }
    const user = await this.userEntityModel.findOne({
        _id: payload.sub,
        is_active: true
    });
    if(!user) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found!'
      });
    }

    return { ...payload, ...user };
  }
}
