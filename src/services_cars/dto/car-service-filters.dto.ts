

// export class CarServiceFiltersDto {

//     @IsOptional()
//     @IsInt({ each: true })
//     @Transform(({ value }) =>
//         Array.isArray(value) ? value.map(Number) : [Number(value)]
//     )

// }

import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsOptional, IsInt, IsNumber, Min } from 'class-validator'
// cityId?: number
// brandIds?: number[] // ID брендов
// masterTypeIds?: number[]


export class CarServiceFiltersDto {
    @ApiPropertyOptional({ example: 1 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    page?: number = 1

    @ApiPropertyOptional({ example: 10 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    limit?: number = 10


    @ApiPropertyOptional({ example: [2, 3], type: [Number] })
    @IsOptional()
    @IsInt({ each: true })
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map(Number) : [Number(value)]
    )
    masterTypeIds?: number[]

    @ApiPropertyOptional({ example: [2, 3], type: [Number] })
    @IsOptional()
    @IsInt({ each: true })
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map(Number) : [Number(value)]
    )
    brandIds?: number[]

    cityId?: number

}
