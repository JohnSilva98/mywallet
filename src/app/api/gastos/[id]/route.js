import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Helper function para obter usuário autenticado via NextAuth
async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

// GET - Buscar um gasto específico do usuário logado
export async function GET(request, { params }) {
  try {
    const userId = await getUserFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const gasto = await prisma.gasto.findFirst({
      where: { 
        id,
        userId // Garantir que o gasto pertence ao usuário
      },
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
    const userId = await getUserFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { nome, valor, categoria, data, tipo } = body;

    // Verificar se o gasto existe e pertence ao usuário
    const gastoExistente = await prisma.gasto.findFirst({
      where: { 
        id,
        userId 
      },
    });

    if (!gastoExistente) {
      return NextResponse.json(
        { error: "Gasto não encontrado" },
        { status: 404 }
      );
    }

    const atualizado = await prisma.gasto.update({
      where: { id },
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

// DELETE - Deletar um gasto do usuário logado
export async function DELETE(request, { params }) {
  try {
    const userId = await getUserFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar se o gasto existe e pertence ao usuário
    const gastoExistente = await prisma.gasto.findFirst({
      where: { 
        id,
        userId 
      },
    });

    if (!gastoExistente) {
      return NextResponse.json(
        { error: "Gasto não encontrado" },
        { status: 404 }
      );
    }

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
