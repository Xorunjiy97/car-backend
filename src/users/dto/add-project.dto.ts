import { IsEmail, IsNumber } from 'class-validator';

export class AddProjectDto {
  @IsEmail()
  email: string;

  @IsNumber()
  projectId: number;
}
