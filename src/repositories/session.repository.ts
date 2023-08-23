import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { Repository } from 'typeorm';

export class SessionRepository extends Repository<Session> {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {
    super(
      sessionRepository.target,
      sessionRepository.manager,
      sessionRepository.queryRunner,
    );
  }
}
