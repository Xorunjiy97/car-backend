import { Repository } from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {
    super(repository.target, repository.manager);
  }
}
