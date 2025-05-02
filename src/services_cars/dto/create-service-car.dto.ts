import { IsString, IsInt, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer'

export class CreateCarServiceDto {
    @ApiProperty({ example: 'г. Баку, ул. Нефтяников, 12', description: 'Адрес сервиса' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'ID города' })
    @IsInt()
    cityId: number;

    @Transform(({ value }) => JSON.parse(value))
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    brandIds: number[]
  
    @ApiProperty({
      example: [1, 3],
      description: 'ID типов мастеров (в JSON формате в FormData)',
      type: [Number],
    })
    @Transform(({ value }) => JSON.parse(value))
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    masterTypeIds: number[]

    @ApiProperty({ example: 'г. Баку, ул. Нефтяников, 12', description: 'Адрес сервиса' })
    @IsString()
    address: string;

    @ApiProperty({ example: '+994501112233', description: 'Мобильный номер' })
    @IsString()
    mobile: string;

    @ApiProperty({ example: '+994501112233', description: 'WhatsApp номер', required: false })
    @IsOptional()
    @IsString()
    whatsapp?: string;

    @ApiProperty({ example: '@your_service', description: 'Telegram username', required: false })
    @IsOptional()
    @IsString()
    telegram?: string;

    @ApiProperty({ example: 'https://yourbucket.s3.amazonaws.com/video.mp4', description: 'Ссылка на видео', required: false })
    @IsOptional()
    @IsString()
    videoLink?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Главное фото (аватар)',
    })
    @IsOptional()
    avatar?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        required: false,
        description: 'Фотографии сервиса',
    })
    @IsOptional()
    @IsArray()
    photos?: string[];
}
