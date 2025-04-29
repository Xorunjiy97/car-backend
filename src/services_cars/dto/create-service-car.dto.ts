import { IsString, IsInt, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarServiceDto {
    @IsInt()
    cityId: number

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    brandIds: number[]

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    modelIds: number[]

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    masterTypeIds: number[]

    @IsString()
    address: string

    @IsString()
    contactInfo: string

    @IsOptional()
    @IsString()
    videoLink?: string


    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Главное фото (аватар)' })
    @IsOptional()
    avatar?: string;

    @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: false, description: 'Фотографии машины' })
    @IsOptional()
    @IsArray()
    photos?: string[];
}