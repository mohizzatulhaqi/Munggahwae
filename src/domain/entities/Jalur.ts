import { ReactNode } from "react";

export interface JalurProps {
  id?: string;
  mountainId: string;
  name: string;
  description?: string;
  difficultyLevel?: string;
  estimatedDurationHours?: number;
  maxAltitude?: number;
  createdAt?: Date;
}

export class Jalur {
  private readonly _id: string;
  private _mountainId: string;
  private _name: string;
  private _description?: string;
  private _difficultyLevel?: string;
  private _estimatedDurationHours?: number;
  private _maxAltitude?: number;
  private _createdAt: Date;

  constructor(props: JalurProps) {
    this.validateName(props.name);
    this.validateDuration(props.estimatedDurationHours);
    this.validateAltitude(props.maxAltitude);
    
    this._id = props.id || this.generateId();
    this._mountainId = props.mountainId;
    this._name = props.name;
    this._description = props.description;
    this._difficultyLevel = props.difficultyLevel;
    this._estimatedDurationHours = props.estimatedDurationHours;
    this._maxAltitude = props.maxAltitude;
    this._createdAt = props.createdAt || new Date();
  }

  // Business Rules & Validations
  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Nama jalur minimal 2 karakter');
    }
    if (name.trim().length > 100) {
      throw new Error('Nama jalur maksimal 100 karakter');
    }
  }

  private validateDuration(duration?: number): void {
    if (duration !== undefined && (duration <= 0 || duration > 72)) {
      throw new Error('Durasi estimasi harus antara 1-72 jam');
    }
  }

  private validateAltitude(altitude?: number): void {
    if (altitude !== undefined && (altitude <= 0 || altitude > 5000)) {
      throw new Error('Ketinggian maksimal harus antara 1-5000 meter');
    }
  }

  private generateId(): string {
    return `jalur_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Business Methods
  public updateJalurInfo(
    name?: string,
    description?: string,
    difficultyLevel?: string,
    estimatedDurationHours?: number,
    maxAltitude?: number
  ): void {
    if (name) {
      this.validateName(name);
      this._name = name;
    }
    
    if (description) {
      this._description = description;
    }
    
    if (difficultyLevel) {
      this._difficultyLevel = difficultyLevel;
    }
    
    if (estimatedDurationHours !== undefined) {
      this.validateDuration(estimatedDurationHours);
      this._estimatedDurationHours = estimatedDurationHours;
    }
    
    if (maxAltitude !== undefined) {
      this.validateAltitude(maxAltitude);
      this._maxAltitude = maxAltitude;
    }
  }

  public getDifficultyLevel(): string {
    return this._difficultyLevel || 'Sedang';
  }

  public isEasy(): boolean {
    return this._difficultyLevel === 'Mudah';
  }

  public isHard(): boolean {
    return this._difficultyLevel === 'Sulit';
  }

  public getEstimatedDuration(): string {
    if (!this._estimatedDurationHours) return 'Tidak ditentukan';
    return `${this._estimatedDurationHours} jam`;
  }

  // Getters
  get id(): string { return this._id; }
  get mountainId(): string { return this._mountainId; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get difficultyLevel(): string | undefined { return this._difficultyLevel; }
  get estimatedDurationHours(): number | undefined { return this._estimatedDurationHours; }
  get maxAltitude(): number | undefined { return this._maxAltitude; }
  get createdAt(): Date { return this._createdAt; }

  public toJSON() {
    return {
      id: this._id,
      mountainId: this._mountainId,
      name: this._name,
      description: this._description,
      difficultyLevel: this._difficultyLevel,
      estimatedDurationHours: this._estimatedDurationHours,
      maxAltitude: this._maxAltitude,
      createdAt: this._createdAt,
    };
  }
} 