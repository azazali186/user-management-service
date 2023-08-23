import { Repository } from 'typeorm';
import { AES, enc } from 'crypto-js';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { SearchUserDto } from 'src/dto/search-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { RoleRepository } from './role.repository';
import { Session } from 'src/entities/session.entity';
import { SessionRepository } from './session.repository';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoleRepository)
    public roleRepository: RoleRepository,
    @InjectRepository(SessionRepository)
    public sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async getUsers(filterDto: SearchUserDto): Promise<User[]> {
    const { status, search } = filterDto;
    const query = this.userRepository.createQueryBuilder('user');

    if (status) {
      query.andWhere('user.status = :status', { status });
    }
    if (search) {
      query.andWhere('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`,
      });
    }

    const products = await query
      .leftJoinAndSelect('user.role', 'role')
      .getMany();

    return products;
  }

  async register(registerDto: RegisterDto) {
    const { name, email } = registerDto;
    const oldUser = await this.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
    let roleId;
    let roleName;
    let role = await this.roleRepository.findOne({
      where: {
        name: 'customer',
      },
    });
    if (!role) {
      role = this.roleRepository.create({
        name: 'customer',
      });
      await this.roleRepository.save(role);

      roleId = role.id;
      roleName = role.name;
    } else {
      roleId = role.id;
      roleName = role.name;
    }
    if (oldUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User registered with ${email} email`,
      });
    }
    const hashPassord = AES.encrypt(
      registerDto.password,
      process.env.ENCRYPTION_KEY,
    ).toString();

    const user = new User();
    user.name = name;
    user.email = email.toLowerCase();
    user.password = hashPassord;
    user.roles = [role];
    await this.userRepository.save(user);
    const { status, password, ...others } = user;

    return { ...others };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.findOne({
      where: {
        email: email.toLowerCase(),
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User not registered with ${email} email`,
      });
    }

    const hashPassord = AES.decrypt(
      user.password,
      process.env.ENCRYPTION_KEY,
    ).toString(enc.Utf8);
    if (hashPassord === password) {
      const payload = { sub: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET}`,
      });
      const tokenString = AES.encrypt(
        token,
        process.env.ENCRYPTION_KEY_TOKEN,
      ).toString();

      const session = new Session();
      session.token = token;
      session.user = user;
      session.stringToken = tokenString;
      session.expires_at = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiry
      session.is_expired = false;

      this.sessionRepository.save(session);

      const roles = user.roles.map((role) => role.name);
      let permissions = [];

      user.roles.forEach((role) => {
        if (role.permissions) {
          permissions = [
            ...permissions,
            ...role.permissions.map((permission) => permission.name),
          ];
        }
      });

      const userEntity = {
        name: user.name,
        email: user.email,
        status: user.status,
      };
      permissions = [...new Set(permissions)];
      const response = {
        user: userEntity,
        roles,
        permissions,
        token: tokenString,
      };
      return response;
    }

    throw new NotFoundException({
      statusCode: 404,
      message: `Email and password combination incorrect`,
    });
  }

  async updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (updateData.roleIds) {
      userToUpdate.roles = await this.roleRepository.findByIds(
        updateData.roleIds,
      );
      delete updateData.roleIds; // Remove roleIds from the main update object
    }

    if (updateData.password) {
      userToUpdate.password = await bcrypt.hash(updateData.password, 10);
      delete updateData.password; // Remove the plain text password from the main update object
    }

    this.userRepository.merge(userToUpdate, updateData); // Merge the updated values

    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }
}
