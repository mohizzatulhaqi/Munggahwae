export interface IPeraturanRepository {
  getPeraturanByGunungId(gunungId: string): Promise<any[]>;
}
