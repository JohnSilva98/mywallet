import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não informamos se o email existe ou não
      return NextResponse.json(
        { message: 'Se o email existir, você receberá um link de recuperação' },
        { status: 200 }
      );
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires
      }
    });

    // Limpar tokens antigos
    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
        expires: {
          lt: new Date()
        }
      }
    });

    // TODO: Enviar email de verdade
    // Por enquanto, vamos apenas logar o token (em produção, usar serviço de email)
    console.log('=== TOKEN DE RECUPERAÇÃO DE SENHA ===');
    console.log(`Email: ${email}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Link: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/resetar-senha?token=${resetToken}`);
    console.log('=====================================');

    // Simular envio de email
    // Em produção, você usaria nodemailer, SendGrid, AWS SES, etc.

    return NextResponse.json(
      { message: 'Email de recuperação enviado com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no forgot password:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
