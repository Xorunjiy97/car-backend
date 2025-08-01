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
import { Expose, Transform, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

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
  readonly bodyTypeId?: number[]

 
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

  @Expose({ name: 'number_of_seats' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  numberOfSeats?: number

  @Expose({ name: 'credit_possible' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  creditPosible?: boolean

  @Expose({ name: 'barter_possible' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  barterPosible?: boolean

  @Expose({ name: 'colored' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  collored?: boolean

  
  @Expose({ name: 'crashed' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  crashed?: boolean

  @Expose({ name: 'needs_renovation' })
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  needsRenovation?: boolean
}
