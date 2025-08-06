import { IsDateString, IsInt, IsString } from "class-validator"

export class CreateAppointmentDto {
    @IsString()
    name: string

    @IsString()
    car: string

    @IsString()
    plateNumber: string

    @IsString()
    description: string

    @IsString()
    phoneNumber: string

    @IsDateString()
    date: string // '2025-08-01'

    @IsString()
    time: string // '10:30'

    @IsInt()
    serviceId: number
}
