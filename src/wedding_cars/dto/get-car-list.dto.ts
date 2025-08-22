// src/cars_lite/dto/get-car-lite-list.dto.ts
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { DriverOption } from '../enums/driver-option.enum'

export class GetCarLiteListDto {
  /* ------- пагинация ------- */
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page = 1

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit = 12

  /* ------- фильтры по справочникам ------- */
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  brandId?: number

  @ApiPropertyOptional({ example: [2, 3], type: [Number] })
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)]
  )
  readonly countryId?: number[]

  @ApiPropertyOptional({ example: [2, 3], type: [Number] })
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)]
  )
  readonly engineTypeId?: number[]

  @ApiPropertyOptional({ example: [2, 3], type: [Number] })
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)]
  )
  readonly gearBoxId?: number[]

  /* ------- фильтры по диапазонам ------- */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFromMin?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFromMax?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearMin?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearMax?: number

  @Expose({ name: 'number_of_seats' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  numberOfSeats?: number

  /* ------- новый фильтр ------- */
  @ApiPropertyOptional({
    enum: DriverOption,
    description: 'Фильтр по водителю (без / с водителем / оба варианта)',
  })
  @IsOptional()
  @IsEnum(DriverOption)
  driver?: DriverOption
}
