// users-profile.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common'
import { UsersProfileService } from './users-profile.service'

@Controller('user-profile/:userId')
export class UsersProfileController {
  constructor(private readonly svc: UsersProfileService) {}

  @Get('summary')
  getSummary(@Param('userId') userId: number) {
    return this.svc.getSummary(+userId)
  }

  @Get('listings')
  getListings(
    @Param('userId') userId: number,
    @Query('type') type: 'car'|'part'|'service',
    @Query('limit') limit = '20',
    @Query('cursor') cursor?: string,
    // опционально флаг только опубликованные:
  ) {
    return this.svc.getListings(+userId, type, Number(limit), cursor)
  }
}
