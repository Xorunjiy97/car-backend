// create-part-item.dto.ts
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'



export class CreatePartItemDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsOptional()
    @IsString()
    description?: string

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(1)
    isUsed: number

    @Type(() => Number) @IsNumber() @Min(0)
    price: number

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
