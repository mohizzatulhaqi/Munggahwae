import { IHistoryRepository } from '@/domain/repositories/IHistoryRepository';

export class GetUserHistoryUseCase {
  constructor(private historyRepository: IHistoryRepository) {}
  async execute(userId: string, status?: string, search?: string, page?: number, limit?: number) {
    return this.historyRepository.getUserHistory(userId, status, search, page, limit);
  }
}
