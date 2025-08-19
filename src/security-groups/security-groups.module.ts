import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityGroupsService } from './security-groups.service';
import { SecurityGroupsController } from './security-groups.controller';
import { SecurityGroup , SecurityGroupSchema } from './schemas/security-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SecurityGroup.name, schema: SecurityGroupSchema }]),
  ],
  controllers: [SecurityGroupsController],
  providers: [SecurityGroupsService],
  exports: [SecurityGroupsService],
})
export class SecurityGroupsModule {}