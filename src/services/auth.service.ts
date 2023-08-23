/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entities/user.entity';
import { LoginDto } from 'src/dto/login.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  register(registerDto: RegisterDto) {
    return this.userRepository.register(registerDto);
  }

  async findAll(filterDto: SearchUserDto): Promise<User[]> {
    return this.userRepository.getUsers(filterDto);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['role'],
      where: {
        id,
      },
    });
  }

  login(loginDto: LoginDto) {
    return this.userRepository.login(loginDto);
  }
}