import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RoleRepository } from 'src/repositories/role.repository';
import { Role } from 'src/entities/role.entity';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { Permission } from 'src/entities/permission.entity';
import { Session } from 'src/entities/session.entity';
import { SessionRepository } from 'src/repositories/session.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Session]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserRepository,
    RoleRepository,
    UserService,
    SessionRepository,
  ],
})
export class AuthModule {}
