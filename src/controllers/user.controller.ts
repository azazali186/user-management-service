import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserService } from 'src/services/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('updateUser')
  updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }
}
