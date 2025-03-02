import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities';

import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
