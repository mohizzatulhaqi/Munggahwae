import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { Booking } from '../../domain/entities/Booking';

export class GetBookingByIdUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }
}
