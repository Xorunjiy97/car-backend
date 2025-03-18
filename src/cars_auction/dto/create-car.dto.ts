import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNumber, IsInt, IsArray, IsDate, IsOptional } from 'class-validator';
import { IsString, IsInt, IsNumber, IsDate, IsDateString,IsArray,IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer'; 
export class CreateCarDto {
    @ApiProperty({ example: 'Mercedes G-Class', description: 'Название автомобиля' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'ID бренда' })
    @IsInt()
    brandId: number;

    @ApiProperty({ example: 2, description: 'ID модели' })
    @IsInt()
    modelId: number;

    @ApiProperty({ example: 3, description: 'ID страны' })
    @IsInt()
    countryId: number;

    @ApiProperty({ example: 4, description: 'ID типа двигателя' })
    @IsInt()
    engineTypeId: number;

    @ApiProperty({ example: 5, description: 'ID типа кузова' })
    @IsInt()
    bodyTypeId: number;

    @ApiProperty({ example: 6, description: 'ID коробки передач' })
    @IsInt()
    gearBoxId: number;

    @ApiProperty({ example: 200, description: 'Количество лошадиных сил' })
    @IsInt()
    hp_count: number;

    @ApiProperty({ example: 'AWD', description: 'Привод автомобиля (FWD, RWD, AWD)' })
    @IsString()
    drive_train: string;

    @ApiProperty({ example: 50000, description: 'Минимальная цена' })
    @IsNumber()
    priceFrom: number;

    @ApiProperty({ example: 70000, description: 'Максимальная цена' })
    @IsNumber()
    priceTo: number;

    @ApiProperty({ example: 50000, description: 'Пробег в км' })
    @IsInt()
    mileage: number;

    @ApiProperty({ example: 300, description: 'Мощность двигателя (кВт или л.с.)' })
    @IsInt()
    engine_power: number;

    @ApiProperty({ example: '2024-07-01', description: 'Дата старта аукциона (ISO 8601)' })
    @IsDateString() // ✅ Проверяет, что строка соответствует ISO 8601 (`YYYY-MM-DD`)
    auctionStartDate: string; // ❗️ Дата должна быть строкой, не `Date`

    @ApiProperty({ example: 2022, description: 'Год выпуска' })
    @IsInt()
    year: number;
    
    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Главное фото (аватар)' })
    @IsOptional()
    avatar?: string;

    @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: false, description: 'Фотографии машины' })
    @IsOptional()
    @IsArray()
    photos?: string[];
}
