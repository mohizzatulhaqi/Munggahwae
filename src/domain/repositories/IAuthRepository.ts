export interface IAuthRepository {
  login(email: string, password: string): Promise<any>;
  register(email: string, password: string, namaLengkap: string, phoneNumber?: string): Promise<any>;
  logout(): Promise<any>;
  getUser(): Promise<any>;
}
