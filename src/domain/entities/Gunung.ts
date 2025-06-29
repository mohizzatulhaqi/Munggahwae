export interface GunungProps {
  id?: string;
  nama: string;
  kuota: number;
  deskripsi: string;
  urlGambar: string;
  harga: number;
  lokasi: string;
  provinsi: string;
  kuotaPerHari: number;
  hargaPerOrang: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Gunung {
  private readonly _id: string;
  private _nama: string;
  private _kuota: number;
  private _deskripsi: string;
  private _urlGambar: string;
  private _harga: number;
  private _lokasi: string;
  private _provinsi: string;
  private _kuotaPerHari: number;
  private _hargaPerOrang: number;
  private _status: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: GunungProps) {
    this.validateNama(props.nama);
    this.validateKuota(props.kuota);
    this.validateHarga(props.harga, props.hargaPerOrang);
    this.validateKuotaPerHari(props.kuotaPerHari);
    
    this._id = props.id || this.generateId();
    this._nama = props.nama;
    this._kuota = props.kuota;
    this._deskripsi = props.deskripsi;
    this._urlGambar = props.urlGambar;
    this._harga = props.harga;
    this._lokasi = props.lokasi;
    this._provinsi = props.provinsi;
    this._kuotaPerHari = props.kuotaPerHari;
    this._hargaPerOrang = props.hargaPerOrang;
    this._status = props.status || 'active';
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Business Rules & Validations
  private validateNama(nama: string): void {
    if (!nama || nama.trim().length < 3) {
      throw new Error('Nama gunung minimal 3 karakter');
    }
    if (nama.trim().length > 100) {
      throw new Error('Nama gunung maksimal 100 karakter');
    }
  }

  private validateKuota(kuota: number): void {
    if (kuota <= 0) {
      throw new Error('Kuota harus lebih dari 0');
    }
    if (kuota > 1000) {
      throw new Error('Kuota maksimal 1000 orang');
    }
  }

  private validateHarga(harga: number, hargaPerOrang: number): void {
    if (harga <= 0) {
      throw new Error('Harga harus lebih dari 0');
    }
    if (hargaPerOrang <= 0) {
      throw new Error('Harga per orang harus lebih dari 0');
    }
    if (hargaPerOrang < harga) {
      throw new Error('Harga per orang tidak boleh kurang dari harga dasar');
    }
  }

  private validateKuotaPerHari(kuotaPerHari: number): void {
    if (kuotaPerHari <= 0) {
      throw new Error('Kuota per hari harus lebih dari 0');
    }
    if (kuotaPerHari > this._kuota) {
      throw new Error('Kuota per hari tidak boleh melebihi kuota total');
    }
  }

  private generateId(): string {
    return `gunung_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Business Methods
  public updateGunungInfo(
    nama?: string, 
    deskripsi?: string, 
    urlGambar?: string, 
    lokasi?: string, 
    provinsi?: string
  ): void {
    if (nama) {
      this.validateNama(nama);
      this._nama = nama;
    }
    
    if (deskripsi) {
      this._deskripsi = deskripsi;
    }
    
    if (urlGambar) {
      this._urlGambar = urlGambar;
    }
    
    if (lokasi) {
      this._lokasi = lokasi;
    }
    
    if (provinsi) {
      this._provinsi = provinsi;
    }
    
    this._updatedAt = new Date();
  }

  public updatePricing(harga: number, hargaPerOrang: number): void {
    this.validateHarga(harga, hargaPerOrang);
    this._harga = harga;
    this._hargaPerOrang = hargaPerOrang;
    this._updatedAt = new Date();
  }

  public updateQuota(kuota: number, kuotaPerHari: number): void {
    this.validateKuota(kuota);
    this._kuota = kuota;
    this.validateKuotaPerHari(kuotaPerHari);
    this._kuotaPerHari = kuotaPerHari;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._status = 'active';
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._status = 'inactive';
    this._updatedAt = new Date();
  }

  public isActive(): boolean {
    return this._status === 'active';
  }

  public canAcceptBookings(): boolean {
    return this.isActive() && this._kuota > 0;
  }

  public calculateTotalPrice(jumlahPemesan: number): number {
    if (jumlahPemesan <= 0) {
      throw new Error('Jumlah pemesan harus lebih dari 0');
    }
    return this._hargaPerOrang * jumlahPemesan;
  }

  public getAvailableQuota(): number {
    return this._kuota;
  }

  public getDailyQuota(): number {
    return this._kuotaPerHari;
  }

  // Getters
  get id(): string { return this._id; }
  get nama(): string { return this._nama; }
  get kuota(): number { return this._kuota; }
  get deskripsi(): string { return this._deskripsi; }
  get urlGambar(): string { return this._urlGambar; }
  get harga(): number { return this._harga; }
  get lokasi(): string { return this._lokasi; }
  get provinsi(): string { return this._provinsi; }
  get kuotaPerHari(): number { return this._kuotaPerHari; }
  get hargaPerOrang(): number { return this._hargaPerOrang; }
  get status(): string { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  public toJSON() {
    return {
      id: this._id,
      nama: this._nama,
      kuota: this._kuota,
      deskripsi: this._deskripsi,
      urlGambar: this._urlGambar,
      harga: this._harga,
      lokasi: this._lokasi,
      provinsi: this._provinsi,
      kuotaPerHari: this._kuotaPerHari,
      hargaPerOrang: this._hargaPerOrang,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 