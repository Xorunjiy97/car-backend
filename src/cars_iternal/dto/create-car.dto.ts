import { ApiProperty } from '@nestjs/swagger'
import {
    IsString,
    IsInt,
    IsNumber,
    IsBoolean,
    IsEmail,
    IsArray,
    IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCarDto {
    /* --------------------------------- базовое -------------------------------- */

    @ApiProperty({ example: 'Mercedes G-Class', description: 'Название автомобиля' })
    @IsString()
    name: string

    /* ----------------------------- связи / справочники ------------------------ */

    @ApiProperty({ example: 1, description: 'ID бренда' })
    @Type(() => Number)
    @IsInt()
    brandId: number

    @ApiProperty({ example: 2, description: 'ID модели' })
    @Type(() => Number)
    @IsInt()
    modelId: number

    @ApiProperty({ example: 3, description: 'ID страны-производителя' })
    @Type(() => Number)
    @IsInt()
    countryId: number

    @ApiProperty({ example: 4, description: 'ID двигателя' })
    @Type(() => Number)
    @IsInt()
    engineTypeId: number

    @ApiProperty({ example: 5, description: 'ID города' })
    @Type(() => Number)
    @IsInt()
    cityId: number

    @ApiProperty({ example: 6, description: 'ID типа кузова' })
    @Type(() => Number)
    @IsInt()
    bodyTypeId: number

    @ApiProperty({ example: 7, description: 'ID коробки передач' })
    @Type(() => Number)
    @IsInt()
    gearBoxId: number

    @ApiProperty({ example: 8, description: 'ID технологии (топливной / гибридной и т.п.)' })
    @Type(() => Number)
    @IsInt()
    technologyId: number

    /* ------------------------------ числовые поля ----------------------------- */

    @ApiProperty({ example: 200, description: 'Лошадиные силы' })
    @Type(() => Number)
    @IsInt()
    hp_count: number

    @ApiProperty({ example: 5, description: 'Количество мест' })
    @Type(() => Number)
    @IsInt()
    number_of_seats: number

    @ApiProperty({ example: 300, description: 'Мощность двигателя' })
    @Type(() => Number)
    @IsInt()
    engine_power: number

    @ApiProperty({ example: 50000, description: 'Пробег, км' })
    @Type(() => Number)
    @IsInt()
    mileage: number

    @ApiProperty({ example: 2022, description: 'Год выпуска' })
    @Type(() => Number)
    @IsInt()
    year: number

    @ApiProperty({ example: 70000, description: 'Цена USD' })
    @Type(() => Number)
    @IsNumber()
    price: number

    /* ------------------------------ строковые поля ---------------------------- */

    @ApiProperty({ example: 'black', description: 'Цвет кузова' })
    @IsString()
    color: string

    @ApiProperty({ example: 'WDCYC7BF3FX123456', description: 'VIN-код' })
    @IsString()
    vin_code: string

    /* ----------------------------- булевые флаги ------------------------------ */

    @ApiProperty({ example: true, description: 'Возможен кредит', required: false })
    @IsOptional()
    @IsBoolean()
    credit_posible?: boolean

    @ApiProperty({ example: false, description: 'Возможен обмен', required: false })
    @IsOptional()
    @IsBoolean()
    barter_posible?: boolean

    @ApiProperty({ example: false, description: 'Битый автомобиль', required: false })
    @IsOptional()
    @IsBoolean()
    crashed?: boolean

    @ApiProperty({ example: true, description: 'Перекрашен', required: false })
    @IsOptional()
    @IsBoolean()
    collored?: boolean

    @ApiProperty({ example: false, description: 'Нуждается в ремонте', required: false })
    @IsOptional()
    @IsBoolean()
    needs_renovation?: boolean

    @ApiProperty({ example: false, description: 'Проверено модератором', required: false })
    @IsOptional()
    @IsBoolean()
    moderated?: boolean

    /* ------------------------------ контактные данные ------------------------- */

    @ApiProperty({ example: 'Иван', description: 'Имя владельца' })
    @IsString()
    user_name: string

    @ApiProperty({ example: 'ivan@example.com', description: 'Email владельца' })
    @IsEmail()
    user_email: string

    @ApiProperty({ example: '+994501112233', description: 'Телефон владельца' })
    @IsString()
    user_phone: string

    /* ------------------------------- описание --------------------------------- */

    @ApiProperty({
        example: 'Машина в идеальном состоянии, один владелец.',
        description: 'Подробное описание объявления',
    })
    @IsString()
    description: string

    /* --------------------------- медиа-контент -------------------------------- */

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Главное фото (аватар)',
    })
    @IsOptional()
    avatar?: string

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        required: false,
        description: 'Фотографии автомобиля',
    })
    @IsOptional()
    @IsArray()
    photos?: string[]

    @ApiProperty({
        example: 'https://youtu.be/your_video',
        description: 'Ссылка на видео с автомобилем',
        required: false,
    })
    @IsOptional()
    @IsString()
    videoLink?: string
}
