// src/car_short_videos/dto/create-car-short-video.dto.ts
import { IsInt, IsOptional, IsString, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCarShortVideoDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    brandId: number   // FK → CarBrandIternal

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    modelId: number   // FK → CarModelIternar

    @IsOptional()
    @IsString()
    description?: string
}
