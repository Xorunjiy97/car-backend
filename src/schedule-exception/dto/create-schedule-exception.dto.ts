import { IsDateString, IsOptional, IsString, IsInt } from 'class-validator'

export class CreateScheduleExceptionDto {
    @IsDateString()
    date: string // '2025-08-01'

    @IsOptional()
    @IsString()
    time?: string // '10:30'

    @IsInt()
    serviceId: number
}
