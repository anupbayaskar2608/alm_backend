import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateRegionDto } from './dto/create-region.dto';

@Controller('regions')
@UseGuards(JwtAuthGuard)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async getRegions() {
    const regions = await this.regionsService.findAll();
    return { regions };
  }

  @Post()
  async createRegion(@Body() regionData: CreateRegionDto) {
    return await this.regionsService.create(regionData);
  }

  @Put(':id')
  async updateRegion(@Param('id') id: string, @Body() regionData: CreateRegionDto) {
    return await this.regionsService.update(id, regionData);
  }

  @Delete(':id')
  async deleteRegion(@Param('id') id: string) {
    await this.regionsService.delete(id);
    return { message: 'Region deleted successfully' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const region = await this.regionsService.findById(id);
    if (!region) {
      return { success: false, message: 'Region not found' };
    }
    return { success: true, region };
  }
}