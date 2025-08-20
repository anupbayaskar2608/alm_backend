import { Module } from '@nestjs/common';
import { IpPoolsService } from './ip-pools.service';
import { IpPoolsController } from './ip-pools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IpPool, IpPoolSchema } from './schemas/ip-pool.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: IpPool.name, schema: IpPoolSchema }])],
  controllers: [IpPoolsController],
  providers: [IpPoolsService],
})
export class IpPoolsModule {}
