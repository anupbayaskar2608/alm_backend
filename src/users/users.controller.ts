import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Post()
  async createUser(@Body() userData: any) {
    return await this.usersService.create(userData);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, userdata: user };
  }
}