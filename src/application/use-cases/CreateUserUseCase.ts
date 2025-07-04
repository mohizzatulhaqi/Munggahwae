import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: any) {
    return this.userRepository.createUser(data);
  }
}
