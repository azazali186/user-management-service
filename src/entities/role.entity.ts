import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  EntityManager,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];

  static async getDefaultRole(entityManager: EntityManager): Promise<Role> {
    let role = await entityManager.findOne(Role, {
      where: { name: 'customer' },
    });
    if (!role) {
      role = new Role();
      role.name = 'customer';
      role.description = 'Default customer role';
      await entityManager.save(Role, role);
    }
    return role;
  }

  static async getAdminRole(entityManager: EntityManager): Promise<Role> {
    let role = await entityManager.findOne(Role, {
      where: { name: 'admin' },
    });
    if (!role) {
      role = new Role();
      role.name = 'admin';
      role.description = 'Default admin role';
      await entityManager.save(Role, role);
    }
    return role;
  }
}
