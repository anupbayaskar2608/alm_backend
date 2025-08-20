import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RegionsModule } from "./regions/regions.module";
import { DepartmentsModule } from "./departments/departments.module";
import { ServicesModule } from "./services/services.module";
import { ApplicationModule } from "./applications/applications.module";
import { WorkloadsModule } from "./workloads/workloads.module";
import { AppVmsModule } from "./app-vms/app-vms.module";
import { SecurityGroupsModule } from './security-groups/security-groups.module';
import { IpPoolsModule } from './ip-pools/ip-pools.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RegionsModule,
    DepartmentsModule,
    ServicesModule,
    ApplicationModule,
    SecurityGroupsModule,
    WorkloadsModule,
    IpPoolsModule,
    AppVmsModule,
  ],
})
export class AppModule {}
