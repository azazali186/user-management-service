import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(
      roleRepository.target,
      roleRepository.manager,
      roleRepository.queryRunner,
    );
  }
}
