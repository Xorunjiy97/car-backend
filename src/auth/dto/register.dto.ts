import { IsEmail, IsNotEmpty ,IsPhoneNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Введите пароль' })
  password: string;
}
