// update-part-item.dto.ts
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class UpdatePartItemDto {
    @IsOptional() @IsString() title?: string
    @IsOptional() @IsString() description?: string

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(1)
    isUsed: number

    @Type(() => Number) @IsNumber() @Min(0)
    price: number

    @IsOptional() @IsString() sellerName?: string
    @IsOptional() @IsString() sellerPhone?: string

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    category_id?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    brand_id?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    model_id?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    city_id?: number

    // для медиа-операций
    @IsOptional() @Transform(({ value }) => value === true || value === 'true')
    removeAvatar?: boolean


    @IsOptional()
    @Transform(({ value }) => {
        try { const arr = JSON.parse(value); return Array.isArray(arr) ? arr : [] } catch { return [] }
    })
    removePhotos?: string[] // сюда прилетит массив путей типа "/uploads/parts/abc.jpg"
}
