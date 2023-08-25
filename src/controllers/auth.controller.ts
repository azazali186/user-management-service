import {
  All,
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { User } from 'src/entities/user.entity';
import { UserStatusValidationPipes } from 'src/pipes/user-status-validation.pipe';
import { AuthService } from 'src/services/auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('/users')
  findAll(
    @Query(UserStatusValidationPipes) filterDto: SearchUserDto,
  ): Promise<User[]> {
    return this.authService.findAll(filterDto);
  }

  @Get('/users/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.authService.findOne(id);
  }

  @Post('/login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Fallback route
  @All('*')
  handleFallback() {
    throw new BadRequestException({
      statusCode: 400,
      message: `bad request`,
    });
  }
}
