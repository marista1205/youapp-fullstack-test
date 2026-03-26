import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // 🔥 REGISTER
  async register(body: any) {
    const { email, password, name, age, gender } = body;

    if (!email || !password || !name || !age || !gender) {
      throw new BadRequestException('Semua field wajib diisi');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      age: Number(age),
      gender,
    });

    return {
      message: 'Register success',
      user,
    };
  }

  // 🔥 LOGIN
  async login(body: any) {
    const { email, password } = body;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password salah');
    }

    const token = this.jwtService.sign({
      userId: user._id,
      email: user.email,
    });

    return {
      message: 'Login success',
      token,
    };
  }

  // 🔥 GET PROFILE
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    return {
      user,
    };
  }

  // 🔥 UPDATE PROFILE
  async updateProfile(userId: string, body: any) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        name: body.name,
        age: Number(body.age),
        gender: body.gender,
      },
      { new: true },
    );

    return {
      message: 'Profile updated',
      user,
    };
  }

  // 🔥 ADD INTEREST (FIX ERROR KAMU)
  async addInterest(userId: string, body: any) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          interests: { $each: body.interests },
        },
      },
      { new: true },
    );

    return {
      message: 'Interest berhasil ditambahkan',
      user,
    };
  }

  // 🔥 GET INTEREST (BIAR CONTROLLER GA ERROR)
  async getInterest(userId: string) {
    const user = await this.userModel.findById(userId);

    return {
      interests: user?.interests || [],
    };
  }
}