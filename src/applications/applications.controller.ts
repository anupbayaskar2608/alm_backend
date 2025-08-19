// src/application/application.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body ,UseGuards } from '@nestjs/common';
import { ApplicationService } from './applications.service';
import { Application } from './schemas/applications.schema';



@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.applicationService.findById(id);
  }

  @Post()
  create(@Body() data: Partial<Application>) {
    return this.applicationService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Application>) {
    return this.applicationService.update(id, data);
  }
 
   @Delete(':id')
  async softDelete(
    @Param('id') id: string
    //@CurrentUser('fullName') username: string,
   ) {
    //console.log(username);
     
    return this.applicationService.delete(id);
  }
}
