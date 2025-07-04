import { IJalurRepository } from '@/domain/repositories/IJalurRepository';

export class GetJalurByGunungIdUseCase {
  constructor(private jalurRepository: IJalurRepository) {}

  async execute(gunungId: string) {
    return this.jalurRepository.getJalurByGunungId(gunungId);
  }
}
