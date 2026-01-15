import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Buscar um gasto específico
export async function GET(request, { params }) {
  try {
    const gasto = await prisma.gasto.findUnique({
      where: { id: params.id },
    });

    if (!gasto) {
      return NextResponse.json(
        { error: "Gasto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(gasto);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar gasto" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um gasto
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { nome, valor, categoria, data } = body;

    const gasto = await prisma.gasto.update({
      where: { id: params.id },
      data: {
        nome,
        valor: parseFloat(valor),
        categoria,
        data: new Date(data),
      },
    });

    return NextResponse.json(gasto);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar gasto" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar um gasto
export async function DELETE(request, { params }) {
  try {
    await prisma.gasto.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Gasto deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar gasto" },
      { status: 500 }
    );
  }
}
