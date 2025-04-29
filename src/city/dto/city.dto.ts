import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCityDto {
    @ApiProperty({ example: 'Germany', description: 'Название рынка' })
    @IsString()
    @Length(1, 255)
    name: string;
}
