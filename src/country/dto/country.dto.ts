import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCountyDto {
    @ApiProperty({ example: 'Germany', description: 'Название рынка' })
    @IsString()
    @Length(1, 255)
    name: string;
}
