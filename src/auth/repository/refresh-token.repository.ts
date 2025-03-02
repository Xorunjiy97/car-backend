import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entity/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
