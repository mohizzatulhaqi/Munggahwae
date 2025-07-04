export interface IKuotaHarianRepository {
  getKuotaHarianByGunungId(gunungId: string, jalurId?: string, date?: string): Promise<any[]>;
}
