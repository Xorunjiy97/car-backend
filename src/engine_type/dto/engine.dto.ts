import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateEngineDto {
    @ApiProperty({ example: 'Diesel', description: 'тип мотора' })
    @IsString()
    @Length(1, 255)
    name: string;
}
