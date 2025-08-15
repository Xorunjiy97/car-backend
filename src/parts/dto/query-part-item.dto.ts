import { IsBooleanString, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryPartItemDto {
    @IsOptional()
    @IsString()
    q?: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    category_id?: number

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
    @IsBooleanString()
    isUsed?: string // 'true' | 'false'

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number
}
