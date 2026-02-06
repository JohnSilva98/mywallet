import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Criar resposta que limpa o cookie de autenticação
    const response = NextResponse.json({
      message: 'Logout realizado com sucesso'
    });

    // Remover cookie de autenticação
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expirar imediatamente
    });

    return response;

  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
