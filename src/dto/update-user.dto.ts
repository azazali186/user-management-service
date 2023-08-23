import {
  IsString,
  IsOptional,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  roleIds?: string[];
}
