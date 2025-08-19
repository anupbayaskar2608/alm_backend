import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username, isDeleted: false }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isDeleted: false }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ isDeleted: false }).exec();
  }

  async create(userData: any): Promise<UserDocument> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(id: string, userData: any): Promise<UserDocument> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }

  async initializeRoles(): Promise<void> {
    const count = await this.roleModel.countDocuments();
    if (count === 0) {
      await Promise.all([
        new this.roleModel({ name: 'user' }).save(),
        new this.roleModel({ name: 'moderator' }).save(),
        new this.roleModel({ name: 'admin' }).save(),
      ]);
    }
  }
}