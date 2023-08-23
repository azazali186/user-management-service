import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  email: string;
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/)
  password: string;
  @IsString()
  @IsNotEmpty()
  role: string;
}
