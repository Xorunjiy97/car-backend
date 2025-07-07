import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCarShortVideoDto {
    @IsString()
    @IsNotEmpty()
    brand: string

    @IsString()
    @IsNotEmpty()
    model: string

    @IsString()
    @IsOptional()
    description?: string
}
