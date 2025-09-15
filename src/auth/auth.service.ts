import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role = 'user') {
    const exists = await this.userModel.findOne({ username });
    if (exists) throw new Error('User already exists');
    const created = new this.userModel({ username, password, role });
    return created.save();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const { password: pw, ...rest } = user.toObject();
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: process.env.JWT_EXPIRY || '3600s',
    };
  }
}
