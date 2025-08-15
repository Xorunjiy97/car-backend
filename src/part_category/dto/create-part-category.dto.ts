import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreatePartCategoryDto {
    @ApiProperty({ example: 'Oil', description: 'масла' })
    @IsString()
    @Length(1, 255)
    name: string;
}
