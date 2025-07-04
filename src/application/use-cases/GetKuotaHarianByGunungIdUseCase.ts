import { IKuotaHarianRepository } from '@/domain/repositories/IKuotaHarianRepository';

export class GetKuotaHarianByGunungIdUseCase {
  constructor(private kuotaHarianRepository: IKuotaHarianRepository) {}

  async execute(gunungId: string, jalurId?: string, date?: string) {
    return this.kuotaHarianRepository.getKuotaHarianByGunungId(gunungId, jalurId, date);
  }
}
