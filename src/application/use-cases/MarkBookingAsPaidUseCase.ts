import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { IGunungRepository } from '../../domain/repositories/IGunungRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Booking } from '../../domain/entities/Booking';

export class MarkBookingAsPaidUseCase {
  constructor(
    private bookingRepository: IBookingRepository,
    private gunungRepository: IGunungRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<Booking> {
    // Call repository to mark booking as paid
    return await this.bookingRepository.markAsPaid(id);
  }
}
