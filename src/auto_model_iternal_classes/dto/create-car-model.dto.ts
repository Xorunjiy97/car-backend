import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateCarModelDto {
    @ApiProperty({ example: 'X5', description: 'Название модели' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'ID модели ' })
    @IsInt()
    modelId: number
}
