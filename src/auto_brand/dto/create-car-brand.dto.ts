import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCarBrandDto {
    @ApiProperty({ example: 'BMW', description: 'Название бренда' }) // ✅ Добавляем в Swagger
    @IsString()
    @Length(1, 255)
    name: string;
}
