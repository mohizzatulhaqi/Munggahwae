export interface IHistoryRepository {
  getUserHistory(userId: string, status?: string, search?: string, page?: number, limit?: number): Promise<any[]>;
}
