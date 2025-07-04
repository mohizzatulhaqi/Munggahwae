import { NextResponse } from 'next/server';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { CreateUserUseCase } from '@/application/use-cases/CreateUserUseCase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userRepository = new SupabaseUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const created = await createUserUseCase.execute(body);
    if (!created) {
      return NextResponse.json({ status: 500, isCreated: false });
    }
    return NextResponse.json({ status: 200, isCreated: true, data: created });
  } catch (error) {
    return NextResponse.json({ status: 500, isCreated: false, error: (error as any)?.message || String(error) });
  }
}
