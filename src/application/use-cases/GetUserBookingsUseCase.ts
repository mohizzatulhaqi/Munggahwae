import { IBookingRepository } from '@/domain/repositories/IBookingRepository';

export class GetUserBookingsUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(userId: string) {
    return this.bookingRepository.getBookingsByUserId(userId);
  }
}
