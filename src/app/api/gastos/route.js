import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper function para obter usuário autenticado
async function getUserFromRequest(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  // Extrair userId do token (mock-token-{userId})
  const userId = token.replace('mock-token-', '');
  return userId;
}

// GET - Listar gastos do usuário logado
export async function GET(request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const gastos = await prisma.gasto.findMany({
      where: { userId },
      orderBy: { data: "desc" },
    });
    return NextResponse.json(gastos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar gastos" },
      { status: 500 }
    );
  }
}

// POST - Criar novo registro (Receita ou Despesa) para o usuário logado
export async function POST(request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nome, valor, categoria, data, tipo } = body;

    const registro = await prisma.gasto.create({
      data: {
        nome,
        valor: parseFloat(valor),
        categoria,
        tipo,
        data: new Date(data),
        userId, // Associar ao usuário logado
      },
    });

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
  }
}
