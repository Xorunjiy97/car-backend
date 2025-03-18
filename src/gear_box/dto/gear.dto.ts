import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateGearDto {
    @ApiProperty({ example: 'Automatic ', description: 'тип коробки' })
    @IsString()
    @Length(1, 255)
    name: string;
}
