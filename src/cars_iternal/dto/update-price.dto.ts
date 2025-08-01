// dto/update-price.dto.ts
import { IsNumber, Min } from 'class-validator'

export class UpdateCarPriceDto {
    @IsNumber()
    @Min(0)
    price: number
}
