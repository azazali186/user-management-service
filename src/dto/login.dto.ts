import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}
