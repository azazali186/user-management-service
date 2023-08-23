import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';

export class PermissionRepository extends Repository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(
      permissionRepository.target,
      permissionRepository.manager,
      permissionRepository.queryRunner,
    );
  }
}
