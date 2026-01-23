import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Listar todos os gastos
export async function GET() {
  try {
    const gastos = await prisma.gasto.findMany({
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

// POST - Criar novo registro (Receita ou Despesa)
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, valor, categoria, data, tipo } = body; // Pegando o 'tipo' do formulário

    const registro = await prisma.gasto.create({
      data: {
        nome,
        valor: parseFloat(valor),
        categoria,
        tipo, // Salva se é "receita" ou "despesa"
        data: new Date(data),
      },
    });

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
  }
}
