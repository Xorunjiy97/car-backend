import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNumber, IsInt, IsArray, IsDate, IsOptional } from 'class-validator';
import { IsString, IsInt, IsNumber, IsDate, IsDateString,IsArray,IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer'; 
export class CreateCarDto {
    @ApiProperty({ example: 'Mercedes G-Class', description: 'Название автомобиля' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'ID бренда' })
    @Type(() => Number)
    @IsInt()
    brandId: number;

    @ApiProperty({ example: 2, description: 'ID модели' })
    @Type(() => Number)
    @IsInt()
    modelId: number;

    @ApiProperty({ example: 3, description: 'ID страны' })
    @Type(() => Number)
    @IsInt()
    countryId: number;

    @ApiProperty({ example: 4, description: 'ID типа двигателя' })
    @Type(() => Number)
    @IsInt()
    engineTypeId: number;

    @ApiProperty({ example: 5, description: 'ID типа кузова' })
    @Type(() => Number)
    @IsInt()
    bodyTypeId: number;

    @ApiProperty({ example: 6, description: 'ID коробки передач' })
    @Type(() => Number)
    @IsInt()
    gearBoxId: number;

    @ApiProperty({ example: 200, description: 'Количество лошадиных сил' })
    @Type(() => Number)
    @IsInt()
    hp_count: number;

    @ApiProperty({ example: 'AWD', description: 'Привод автомобиля (FWD, RWD, AWD)' })
    @IsString()
    drive_train: string;

    @ApiProperty({ example: 50000, description: 'Минимальная цена' })
    @Type(() => Number)
    @IsNumber()
    priceFrom: number;

    @ApiProperty({ example: 70000, description: 'Максимальная цена' })
    @Type(() => Number)
    @IsNumber()
    priceTo: number;

    @ApiProperty({ example: 50000, description: 'Пробег в км' })
    @Type(() => Number)
    @IsInt()
    mileage: number;

    @ApiProperty({ example: 300, description: 'Мощность двигателя (кВт или л.с.)' })
    @Type(() => Number)
    @IsInt()
    engine_power: number;

    @ApiProperty({ example: '2024-07-01', description: 'Дата старта аукциона (ISO 8601)' })
    @IsDateString() // ✅ Проверяет, что строка соответствует ISO 8601 (`YYYY-MM-DD`)
    auctionStartDate: string; // ❗️ Дата должна быть строкой, не `Date`

    @ApiProperty({ example: 2022, description: 'Год выпуска' })
    @Type(() => Number)
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
