// src/cars_lite/dto/create-car-lite.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsInt,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsArray,
  IsOptional,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { DriverOption } from '../enums/driver-option.enum'

export class CreateCarLiteDto {
  /* ----------------------------- связи / справочники ------------------------ */

  @ApiProperty({ example: 1, description: 'ID бренда' })
  @Type(() => Number) @IsInt()
  brandId: number

  @ApiProperty({ example: 2, description: 'ID модели' })
  @Type(() => Number) @IsInt()
  modelId: number



  @ApiProperty({ example: 4, description: 'ID двигателя' })
  @Type(() => Number) @IsInt()
  engineTypeId: number

  @ApiProperty({ example: 5, description: 'ID города' })
  @Type(() => Number) @IsInt()
  cityId: number

  @ApiProperty({ example: 6, description: 'ID коробки передач' })
  @Type(() => Number) @IsInt()
  gearBoxId: number

 

  /* ------------------------------ числовые поля ----------------------------- */

  @ApiProperty({ example: 200, description: 'Лошадиные силы' })
  @Type(() => Number) @IsInt()
  hp_count: number

  @ApiProperty({ example: 5, description: 'Количество мест' })
  @Type(() => Number) @IsInt()
  number_of_seats: number

  @ApiProperty({ example: 300, description: 'Мощность двигателя' })
  @Type(() => Number) @IsInt()
  engine_power: number

  @ApiProperty({ example: 2022, description: 'Год выпуска' })
  @Type(() => Number) @IsInt()
  year: number

  @ApiProperty({ example: 70000, description: 'Цена USD' })
  @Type(() => Number) @IsNumber()
  price: number

  /* -------------------------- новое поле: driver ---------------------------- */

  @ApiProperty({
    enum: DriverOption,
    example: DriverOption.BOTH,
    description: 'Водитель: без / с водителем / оба варианта',
  })
  @IsEnum(DriverOption)
  driver: DriverOption

  /* ------------------------------ флаги ------------------------------------- */

  @ApiProperty({ example: false, description: 'Проверено модератором', required: false })
  @IsOptional() @IsBoolean()
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
    example: 'Авто в отличном состоянии.',
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
