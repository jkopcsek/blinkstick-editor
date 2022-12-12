import { Module } from '@nestjs/common';

import { BlinkstickGateway } from './blinkstick.gateway';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, BlinkstickGateway, ],
})
export class AppModule {}
