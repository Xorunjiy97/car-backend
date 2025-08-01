import { IsIn } from 'class-validator'

export class UpdateAppointmentStatusDto {
    @IsIn(['waiting', 'arrived', 'late', 'cancelled'])
    status: 'waiting' | 'arrived' | 'late' | 'cancelled'
}
