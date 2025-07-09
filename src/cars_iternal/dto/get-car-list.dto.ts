// src/cars_iternal/dto/get-car-list.dto.ts
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator'
import { Type } from 'class-transformer'

export class GetCarListDto {
  // пагинация
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

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  readonly countryId?: number[]

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  readonly engineTypeId?: number[]

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  readonly bodyTypeId?: number[]

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
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
  @IsNumber()
  @Min(0)
  mileageMin?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileageMax?: number

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
}
