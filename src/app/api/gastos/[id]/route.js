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

// GET - Buscar um gasto específico do usuário logado
export async function GET(request, { params }) {
  try {
    const userId = await getUserFromRequest(request);
    
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
    const userId = await getUserFromRequest(request);
    
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
    const userId = await getUserFromRequest(request);
    
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
