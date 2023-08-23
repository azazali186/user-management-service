import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  path: string;

  @Column({ default: 'web' })
  guard: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
