import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}
  async execute(email: string, password: string, namaLengkap: string, phoneNumber?: string) {
    return this.authRepository.register(email, password, namaLengkap, phoneNumber);
  }
}
