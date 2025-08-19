import { Controller, Get, Post, Body,Patch, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { SecurityGroupsService } from './security-groups.service';
import { CreateSecurityGroupDto } from './dto/create-security-group.dto';
import { UpdateSecurityGroupDto } from './dto/update-security-group.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('securitygroups')
//@UseGuards(JwtAuthGuard)
export class SecurityGroupsController {
  constructor(private readonly securityGroupsService: SecurityGroupsService) {}

  @Get()
  async getSecurityGroups() {
    const securitygroups = await this.securityGroupsService.findAll();
    return { securitygroups };
  }

  @Post()
  async createSecurityGroup(@Body() securitygroupsData: CreateSecurityGroupDto) {
    return await this.securityGroupsService.create(securitygroupsData);
  }

  @Put(':id')
  async updateSecurityGroup(@Param('id') id: string, @Body() securitygroupsData: UpdateSecurityGroupDto) {
    return await this.securityGroupsService.update(id, securitygroupsData);
  }

  @Delete(':id')
  async deleteSecurityGroup(@Param('id') id: string) {
    await this.securityGroupsService.delete(id);
    return { message: 'Security Group deleted successfully' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const securitygroup = await this.securityGroupsService.findById(id);
    if (!securitygroup) {
      return { success: false, message: 'Security Group not found' };
    }
    return { success: true, securitygroup };
  }
}