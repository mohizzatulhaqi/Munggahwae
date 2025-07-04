import { IPeraturanRepository } from '@/domain/repositories/IPeraturanRepository';

export class GetPeraturanByGunungIdUseCase {
  constructor(private peraturanRepository: IPeraturanRepository) {}

  async execute(gunungId: string) {
    return this.peraturanRepository.getPeraturanByGunungId(gunungId);
  }
}
