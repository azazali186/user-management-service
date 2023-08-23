/* eslint-disable prettier/prettier */
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enum/user-status.enum';

export class SearchUserDto {
  @IsOptional()
  @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE])
  status: UserStatus;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}