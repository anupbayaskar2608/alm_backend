import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Test user for development
    if (email === 'admin@test.com' && password === 'admin123') {
      const payload = {
        userId: '1',
        role: 'admin',
        email: 'admin@test.com',
        fullName: 'Admin User',
      };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign({ payload });
      return { accessToken, refreshToken };
    }
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password is hashed or plain text
    let isPasswordValid = false;
    if (user.password.startsWith('$2')) {
      // Password is hashed with bcrypt
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (for existing users)
      isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
      fullName: `${user.fname} ${user.lname}`,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ payload });

    return { accessToken, refreshToken };
  }

  async createAdmin(adminData: any) {
    // Check if admin already exists
    const existingAdmin = await this.usersService.findByEmail(adminData.email);
    if (existingAdmin) {
      throw new UnauthorizedException('Admin with this email already exists');
    }

    // Create admin user
    const adminUser = {
      ...adminData,
      role: 'admin',
      isDeleted: false,
    };

    return await this.usersService.create(adminUser);
  }
}