import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ unique: true })
  stringToken: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  is_expired: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
