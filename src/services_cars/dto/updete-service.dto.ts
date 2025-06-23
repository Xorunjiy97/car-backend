import { IsString, IsInt, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class UpdateServiceDto {
    @ApiProperty({ example: 'My Service' })
    @IsOptional() @IsString()
    name?: string

    @ApiProperty({ example: 1 })
    @IsOptional() @Type(() => Number) @IsInt()
    cityId?: number

    @IsOptional()
    @Transform(({ value }) => {
        // Если пришёл JSON–string – парсим
        const arr = typeof value === 'string' ? JSON.parse(value) : value
        // Превращаем элементы в числа
        return Array.isArray(arr) ? arr.map(Number) : arr
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    brandIds?: number[]

    @IsOptional()
    @Transform(({ value }) => {
        const arr = typeof value === 'string' ? JSON.parse(value) : value
        return Array.isArray(arr) ? arr.map(Number) : arr
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    masterTypeIds?: number[]

    @IsOptional() @IsString()
    address?: string

    @IsOptional() @IsString()
    mobile?: string

    @IsOptional() @IsString()
    whatsapp?: string

    @IsOptional() @IsString()
    telegram?: string

    @IsOptional() @IsString()
    instagram?: string

    @IsOptional() @IsString()
    videoLink?: string

    // файлы валидируются Multer'ом, поля в DTO не нужны
}
