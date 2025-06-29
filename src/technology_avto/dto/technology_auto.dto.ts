import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateMasterTypeDto {
    @ApiProperty({ example: 'Automatic ', description: 'тип мастерской' })
    @IsString()
    @Length(1, 255)
    name: string;
}
