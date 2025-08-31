// update-car.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateCarLiteDto } from './create-car.dto'

export class UpdateCarLiteDto extends PartialType(CreateCarLiteDto) {}
