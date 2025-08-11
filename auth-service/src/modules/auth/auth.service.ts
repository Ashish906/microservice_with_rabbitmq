import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserModel } from '../users/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserModel) private userEntityModel: ReturnModelType<typeof UserModel>,
  ) {}


  async login(body: LoginDto) {
    const user = await this.userEntityModel.findOne({
        email: body.email,
        is_active: true
    });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const { access_token, refresh_token } = await this.getTokens(user);

    return {
      access_token,
      refresh_token
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

    return newUser;
  }

  async refreshToken(payload: any) {
    const { access_token, refresh_token } = await this.getTokens(payload);

    return {
      access_token,
      refresh_token
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
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}
