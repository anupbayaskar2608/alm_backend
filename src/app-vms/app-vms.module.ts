import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppAndVm, AppAndVmSchema } from './schemas/appvm.schema';
import { AppvmService } from './appvm.service';
import { AppvmController } from './appvm.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppAndVm.name, schema: AppAndVmSchema }]),
  ],
  controllers: [AppvmController],
  providers: [AppvmService],
  exports: [AppvmService],
})
export class AppVmsModule {}
