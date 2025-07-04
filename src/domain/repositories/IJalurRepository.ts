export interface IJalurRepository {
  getJalurByGunungId(gunungId: string): Promise<any[]>;
}
