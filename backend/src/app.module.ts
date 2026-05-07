import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AnalysesModule } from './modules/analyses/analyses.module';

@Module({
  imports: [UsersModule, AnalysesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
