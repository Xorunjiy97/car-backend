// import { ApiPropertyOptional } from '@nestjs/swagger'
// import { Transform, Type } from 'class-transformer'
// import { IsOptional, IsInt, IsNumber, Min } from 'class-validator'

// export class GetCarListDto {
//   @ApiPropertyOptional({ example: 1 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsInt()
//   page?: number = 1

//   @ApiPropertyOptional({ example: 10 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsInt()
//   limit?: number = 10

//   @ApiPropertyOptional({ example: 1 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsInt()
//   brandId?: number

//   @ApiPropertyOptional({ example: [2, 3], type: [Number] })
//   @IsOptional()
//   @IsInt({ each: true })
//   @Transform(({ value }) =>
//     Array.isArray(value) ? value.map(Number) : [Number(value)]
//   )
//   modelId?: number[]
  
//   @ApiPropertyOptional({ example: [1, 4], type: [Number] })
//   @IsOptional()
//   @IsInt({ each: true })
//   @Transform(({ value }) =>
//     Array.isArray(value) ? value.map(Number) : [Number(value)]
//   )
//   countryId?: number[]
  
//   @ApiPropertyOptional({ example: [3], type: [Number] })
//   @IsOptional()
//   @IsInt({ each: true })
//   @Transform(({ value }) =>
//     Array.isArray(value) ? value.map(Number) : [Number(value)]
//   )
//   engineTypeId?: number[]
  
//   @ApiPropertyOptional({ example: [5], type: [Number] })
//   @IsOptional()
//   @IsInt({ each: true })
//   @Transform(({ value }) =>
//     Array.isArray(value) ? value.map(Number) : [Number(value)]
//   )
//   bodyTypeId?: number[]
  
//   @ApiPropertyOptional({ example: [6], type: [Number] })
//   @IsOptional()
//   @IsInt({ each: true })
//   @Transform(({ value }) =>
//     Array.isArray(value) ? value.map(Number) : [Number(value)]
//   )
//   gearBoxId?: number[]
  

//   @ApiPropertyOptional({ example: 30000 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsNumber()
//   priceFromMin?: number

//   @ApiPropertyOptional({ example: 70000 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsNumber()
//   priceFromMax?: number

//   @ApiPropertyOptional({ example: 10000 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsNumber()
//   mileageMin?: number

//   @ApiPropertyOptional({ example: 100000 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsNumber()
//   mileageMax?: number

//   @ApiPropertyOptional({ example: 2015 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsInt()
//   yearMin?: number

//   @ApiPropertyOptional({ example: 2023 })
//   @Type(() => Number)
//   @IsOptional()
//   @IsInt()
//   yearMax?: number
// }
