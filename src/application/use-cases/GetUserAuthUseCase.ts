import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class GetUserAuthUseCase {
  constructor(private authRepository: IAuthRepository) {}
  async execute() {
    return this.authRepository.getUser();
  }
}
