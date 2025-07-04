import { IGunungRepository } from '@/domain/repositories/IGunungRepository';

export class CreateGunungUseCase {
  constructor(private gunungRepository: IGunungRepository) {}

  async execute(data: any) {
    return this.gunungRepository.createGunung(data);
  }
}
