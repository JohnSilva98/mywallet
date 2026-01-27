import { NextRequest, NextResponse } from 'next/server';

// TODO: Implementar lógica real de autenticação com banco de dados
const USERS_MOCK = [
  {
    id: '1',
    email: 'usuario@easynizze.com',
    password: '123456', // Em produção, use hash!
    name: 'Usuário Teste'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário (mock - substituir com Prisma)
    const user = USERS_MOCK.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Criar session/token (simplificado)
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    // Setar cookie de autenticação
    response.cookies.set('auth-token', 'mock-token-' + user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
