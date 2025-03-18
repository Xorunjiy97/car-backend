import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateBodyDto {
    @ApiProperty({ example: 'Cope', description: 'тип кузова' })
    @IsString()
    @Length(1, 255)
    name: string;
}
