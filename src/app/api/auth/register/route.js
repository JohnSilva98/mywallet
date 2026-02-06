import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { nome, email, password } = await request.json();

    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(password, 10);

    // Criar o usuário
    const usuario = await prisma.user.create({
      data: {
        name: nome,
        email: email,
        password: senhaHash,
      }
    });

    return NextResponse.json(
      { message: 'Usuário criado com sucesso', userId: usuario.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}