import { Gunung } from '../entities/Gunung';

export interface IGunungRepository {
  findById(id: string): Promise<Gunung | null>;
  save(gunung: Gunung): Promise<Gunung>;
  update(gunung: Gunung): Promise<Gunung>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Gunung[]>;
  findByProvinsi(provinsi: string): Promise<Gunung[]>;
  findByStatus(status: string): Promise<Gunung[]>;
  findActiveMountains(): Promise<Gunung[]>;
  findAvailableMountains(): Promise<Gunung[]>;
  createGunung(data: any): Promise<any>;
} 