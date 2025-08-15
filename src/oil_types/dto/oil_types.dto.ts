import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateOilTypeDto {
    @ApiProperty({ example: 'Diesel', description: 'тип масла' })
    @IsString()
    @Length(1, 255)
    name: string;
}
