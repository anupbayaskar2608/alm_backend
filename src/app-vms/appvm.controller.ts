import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AppvmService } from './appvm.service';
import { CreateAppVmDto } from './dto/create-appvm.dto';
import { UpdateAppVmDto } from './dto/update-appvm.dto';

@Controller('appvm')
export class AppvmController {
  constructor(private readonly appvmService: AppvmService) {}

  @Get()
  findAll() {
    return this.appvmService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.appvmService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAppVmDto) {
    return this.appvmService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppVmDto) {
    return this.appvmService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appvmService.delete(id);
  }
}
