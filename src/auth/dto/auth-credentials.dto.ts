import { IsEmail, IsNotEmpty, IsString, MinLength,IsPhoneNumber  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @IsPhoneNumber() // Укажите нужный регион
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter password' })
  @MinLength(8, { message: 'Длина пароля должна быть не менее 8 символов' })
  @IsString({ message: 'Name must be a string' })
  password: string;
}
