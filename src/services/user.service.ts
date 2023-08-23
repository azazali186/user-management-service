import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }

  create(createUserDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }
  updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(userId, updateData);
  }
}
