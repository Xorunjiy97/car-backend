import { IsInt, IsString } from "class-validator"

export class WorkingDayDto {
    @IsInt() dayOfWeek: number
    @IsString() startTime: string // '09:00'
    @IsString() endTime: string   // '18:00'
}
