import { User } from './User';
import { Gunung } from './Gunung';
import { Jalur } from './Jalur';

export interface AnggotaPemesanProps {
  id?: string;
  email: string;
  nama: string;
  noIdentitas: string;
  kewarganegaraan?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  fileKtp?: string;
  isCompanion?: boolean;
}

export interface BookingProps {
  id?: string;
  userId?: string;
  mountainId?: string;
  trailId?: string;
  tanggalMasuk: Date;
  tanggalKeluar: Date;
  jumlahPemesan: number;
  totalHarga: number;
  status?: string;
  paymentStatus?: string;
  specialRequests?: string;
  anggotaPemesan?: AnggotaPemesanProps[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class AnggotaPemesan {
  private readonly _id: string;
  private _email: string;
  private _nama: string;
  private _noIdentitas: string;
  private _kewarganegaraan: string;
  private _jenisKelamin?: string;
  private _tempatLahir?: string;
  private _tanggalLahir?: Date;
  private _fileKtp?: string;
  private _isCompanion: boolean;

  constructor(props: AnggotaPemesanProps) {
    this.validateEmail(props.email);
    this.validateNama(props.nama);
    this.validateNoIdentitas(props.noIdentitas);
    
    this._id = props.id || this.generateId();
    this._email = props.email;
    this._nama = props.nama;
    this._noIdentitas = props.noIdentitas;
    this._kewarganegaraan = props.kewarganegaraan || 'Indonesia';
    this._jenisKelamin = props.jenisKelamin;
    this._tempatLahir = props.tempatLahir;
    this._tanggalLahir = props.tanggalLahir;
    this._fileKtp = props.fileKtp;
    this._isCompanion = props.isCompanion || false;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email tidak valid');
    }
  }

  private validateNama(nama: string): void {
    if (!nama || nama.trim().length < 2) {
      throw new Error('Nama minimal 2 karakter');
    }
  }

  private validateNoIdentitas(noIdentitas: string): void {
    if (!noIdentitas || noIdentitas.length < 10) {
      throw new Error('Nomor identitas minimal 10 digit');
    }
  }

  private generateId(): string {
    return `anggota_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public isAdult(): boolean {
    if (!this._tanggalLahir) return false;
    const today = new Date();
    const age = today.getFullYear() - this._tanggalLahir.getFullYear();
    return age >= 17;
  }

  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get nama(): string { return this._nama; }
  get noIdentitas(): string { return this._noIdentitas; }
  get kewarganegaraan(): string { return this._kewarganegaraan; }
  get jenisKelamin(): string | undefined { return this._jenisKelamin; }
  get tempatLahir(): string | undefined { return this._tempatLahir; }
  get tanggalLahir(): Date | undefined { return this._tanggalLahir; }
  get fileKtp(): string | undefined { return this._fileKtp; }
  get isCompanion(): boolean { return this._isCompanion; }
}

export class Booking {
  private readonly _id: string;
  private _userId?: string;
  private _mountainId?: string;
  private _trailId?: string;
  private _tanggalMasuk: Date;
  private _tanggalKeluar: Date;
  private _jumlahPemesan: number;
  private _totalHarga: number;
  private _status: string;
  private _paymentStatus: string;
  private _specialRequests?: string;
  private _anggotaPemesan: AnggotaPemesan[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BookingProps) {
    this.validateDates(props.tanggalMasuk, props.tanggalKeluar);
    this.validateJumlahPemesan(props.jumlahPemesan);
    this.validateTotalHarga(props.totalHarga);
    
    this._id = props.id || this.generateId();
    this._userId = props.userId;
    this._mountainId = props.mountainId;
    this._trailId = props.trailId;
    this._tanggalMasuk = props.tanggalMasuk;
    this._tanggalKeluar = props.tanggalKeluar;
    this._jumlahPemesan = props.jumlahPemesan;
    this._totalHarga = props.totalHarga;
    this._status = props.status || 'pending';
    this._paymentStatus = props.paymentStatus || 'unpaid';
    this._specialRequests = props.specialRequests;
    this._anggotaPemesan = props.anggotaPemesan?.map(ap => new AnggotaPemesan(ap)) || [];
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Business Rules & Validations
  private validateDates(tanggalMasuk: Date, tanggalKeluar: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (tanggalMasuk < today) {
      throw new Error('Tanggal masuk tidak boleh kurang dari hari ini');
    }

    if (tanggalKeluar <= tanggalMasuk) {
      throw new Error('Tanggal keluar harus setelah tanggal masuk');
    }

    const durationInDays = Math.ceil((tanggalKeluar.getTime() - tanggalMasuk.getTime()) / (1000 * 60 * 60 * 24));
    if (durationInDays > 3) {
      throw new Error('Durasi pendakian maksimal 3 hari');
    }
  }

  private validateJumlahPemesan(jumlahPemesan: number): void {
    if (jumlahPemesan < 1) {
      throw new Error('Jumlah pemesan minimal 1');
    }
    if (jumlahPemesan > 10) {
      throw new Error('Jumlah pemesan maksimal 10');
    }
  }

  private validateTotalHarga(totalHarga: number): void {
    if (totalHarga <= 0) {
      throw new Error('Total harga harus lebih dari 0');
    }
  }

  private generateId(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Business Methods
  public addAnggotaPemesan(anggota: AnggotaPemesanProps): void {
    if (this._anggotaPemesan.length >= this._jumlahPemesan) {
      throw new Error('Jumlah anggota pemesan sudah mencapai batas maksimal');
    }
    
    const newAnggota = new AnggotaPemesan(anggota);
    this._anggotaPemesan.push(newAnggota);
    this._updatedAt = new Date();
  }

  public removeAnggotaPemesan(anggotaId: string): void {
    this._anggotaPemesan = this._anggotaPemesan.filter(ap => ap.id !== anggotaId);
    this._updatedAt = new Date();
  }

  public confirmBooking(): void {
    if (this._paymentStatus !== 'paid') {
      throw new Error('Booking hanya dapat dikonfirmasi setelah pembayaran');
    }
    this._status = 'confirmed';
    this._updatedAt = new Date();
  }

  public cancelBooking(): void {
    if (this._status === 'confirmed') {
      throw new Error('Booking yang sudah dikonfirmasi tidak dapat dibatalkan');
    }
    this._status = 'cancelled';
    this._updatedAt = new Date();
  }

  public markAsPaid(): void {
    this._paymentStatus = 'paid';
    this._updatedAt = new Date();
  }

  public canBeConfirmed(): boolean {
    return this._paymentStatus === 'paid' && this._status === 'pending';
  }

  public canBeCancelled(): boolean {
    return this._status === 'pending' || this._status === 'unpaid';
  }

  public getDurationInDays(): number {
    return Math.ceil((this._tanggalKeluar.getTime() - this._tanggalMasuk.getTime()) / (1000 * 60 * 60 * 24));
  }

  public getAdultsCount(): number {
    return this._anggotaPemesan.filter(ap => ap.isAdult()).length;
  }

  public getMinorsCount(): number {
    return this._anggotaPemesan.filter(ap => !ap.isAdult()).length;
  }

  public validateAnggotaPemesan(): boolean {
    return this._anggotaPemesan.length === this._jumlahPemesan;
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string | undefined { return this._userId; }
  get mountainId(): string | undefined { return this._mountainId; }
  get trailId(): string | undefined { return this._trailId; }
  get tanggalMasuk(): Date { return this._tanggalMasuk; }
  get tanggalKeluar(): Date { return this._tanggalKeluar; }
  get jumlahPemesan(): number { return this._jumlahPemesan; }
  get totalHarga(): number { return this._totalHarga; }
  get status(): string { return this._status; }
  get paymentStatus(): string { return this._paymentStatus; }
  get specialRequests(): string | undefined { return this._specialRequests; }
  get anggotaPemesan(): AnggotaPemesan[] { return this._anggotaPemesan; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  public toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      mountainId: this._mountainId,
      trailId: this._trailId,
      tanggalMasuk: this._tanggalMasuk,
      tanggalKeluar: this._tanggalKeluar,
      jumlahPemesan: this._jumlahPemesan,
      totalHarga: this._totalHarga,
      status: this._status,
      paymentStatus: this._paymentStatus,
      specialRequests: this._specialRequests,
      anggotaPemesan: this._anggotaPemesan.map(ap => ({
        id: ap.id,
        email: ap.email,
        nama: ap.nama,
        noIdentitas: ap.noIdentitas,
        kewarganegaraan: ap.kewarganegaraan,
        jenisKelamin: ap.jenisKelamin,
        tempatLahir: ap.tempatLahir,
        tanggalLahir: ap.tanggalLahir,
        fileKtp: ap.fileKtp,
        isCompanion: ap.isCompanion,
      })),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 