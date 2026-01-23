import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Buscar um gasto específico
export async function GET(request, { params }) {
  try {
    const { id } = await params; // ← Adiciona await aqui

    const gasto = await prisma.gasto.findUnique({
      where: { id },
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nome, valor, categoria, data, tipo } = body;

    const atualizado = await prisma.gasto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        valor: parseFloat(valor),
        categoria,
        tipo,
        data: new Date(data),
      },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// DELETE - Deletar um gasto
export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // ← Adiciona await aqui

    await prisma.gasto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Gasto deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar gasto" },
      { status: 500 }
    );
  }
}
