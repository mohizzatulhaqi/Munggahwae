export interface UserProps {
  id?: string;
  namaLengkap: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: string;
  private _namaLengkap: string;
  private _email: string;
  private _phoneNumber?: string;
  private _avatarUrl?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this.validateEmail(props.email);
    this.validateNamaLengkap(props.namaLengkap);
    
    this._id = props.id || this.generateId();
    this._namaLengkap = props.namaLengkap;
    this._email = props.email;
    this._phoneNumber = props.phoneNumber;
    this._avatarUrl = props.avatarUrl;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Business Rules & Validations
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email tidak valid');
    }
  }

  private validateNamaLengkap(namaLengkap: string): void {
    if (!namaLengkap || namaLengkap.trim().length < 2) {
      throw new Error('Nama lengkap minimal 2 karakter');
    }
    if (namaLengkap.trim().length > 100) {
      throw new Error('Nama lengkap maksimal 100 karakter');
    }
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Business Methods
  public updateProfile(namaLengkap?: string, phoneNumber?: string, avatarUrl?: string): void {
    if (namaLengkap) {
      this.validateNamaLengkap(namaLengkap);
      this._namaLengkap = namaLengkap;
    }
    
    if (phoneNumber) {
      this._phoneNumber = phoneNumber;
    }
    
    if (avatarUrl) {
      this._avatarUrl = avatarUrl;
    }
    
    this._updatedAt = new Date();
  }

  public canMakeBooking(): boolean {
    // Business rule: User harus memiliki email dan nama lengkap yang valid
    return Boolean(this._email) && this._namaLengkap.length >= 2;
  }

  // Getters
  get id(): string { return this._id; }
  get namaLengkap(): string { return this._namaLengkap; }
  get email(): string { return this._email; }
  get phoneNumber(): string | undefined { return this._phoneNumber; }
  get avatarUrl(): string | undefined { return this._avatarUrl; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Domain Events
  public toJSON() {
    return {
      id: this._id,
      namaLengkap: this._namaLengkap,
      email: this._email,
      phoneNumber: this._phoneNumber,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 