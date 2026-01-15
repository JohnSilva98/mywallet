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

// POST - Criar novo gasto
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, valor, categoria, data } = body;

    const gasto = await prisma.gasto.create({
      data: {
        nome,
        valor: parseFloat(valor),
        categoria,
        data: new Date(data),
      },
    });

    return NextResponse.json(gasto, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar gasto" }, { status: 500 });
  }
}
