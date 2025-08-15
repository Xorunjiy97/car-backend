// create-part-item.dto.ts
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class CreatePartItemDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    isUsed?: boolean

    @Type(() => Number)
    @IsInt()
    @Min(1)
    category_id: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    brand_id?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    model_id?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    city_id?: number

    @IsOptional()
    @IsString()
    sellerName?: string

    @IsOptional()
    @IsString()
    sellerPhone?: string
}
