import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDefaultOperations } from './swagger/api_operations/default';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  healthCheck(): string {
    return ApiDefaultOperations.HEALTH_CHECK;
  }
}
