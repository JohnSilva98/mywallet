import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Helper function para obter usuário autenticado via NextAuth
async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

// GET - Listar gastos do usuário logado
export async function GET() {
  try {
    const userId = await getUserFromSession();
    
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
    const userId = await getUserFromSession();
    
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
