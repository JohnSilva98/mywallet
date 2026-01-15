"use client";
import { useState, useEffect } from "react";
import FormGasto from "@/components/formGasto";
import ListaGastos from "@/components/listaGasto";

export default function Home() {
  const [gastos, setGastos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gastoParaEditar, setGastoParaEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar gastos ao carregar a página
  const buscarGastos = async () => {
    try {
      const response = await fetch("/api/gastos");
      const data = await response.json();
      setGastos(data);
    } catch (error) {
      console.error("Erro ao buscar gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarGastos();
  }, []);

  const handleGastoAdicionado = () => {
    buscarGastos();
    setMostrarForm(false);
    setGastoParaEditar(null);
  };

  const handleEditar = (gasto) => {
    setGastoParaEditar(gasto);
    setMostrarForm(true);
  };

  const handleDeletar = async (id) => {
    if (confirm("Tem certeza que deseja deletar este gasto?")) {
      try {
        await fetch(`/api/gastos/${id}`, {
          method: "DELETE",
        });
        buscarGastos();
      } catch (error) {
        console.error("Erro ao deletar gasto:", error);
      }
    }
  };

  const handleCancelar = () => {
    setMostrarForm(false);
    setGastoParaEditar(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Controle Financeiro
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus gastos de forma simples
          </p>
        </header>

        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="mb-6 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium"
          >
            + Adicionar Novo Gasto
          </button>
        )}

        <div className="space-y-6">
          {mostrarForm && (
            <FormGasto
              onGastoAdicionado={handleGastoAdicionado}
              gastoParaEditar={gastoParaEditar}
              onCancelar={handleCancelar}
            />
          )}

          <ListaGastos
            gastos={gastos}
            onEditar={handleEditar}
            onDeletar={handleDeletar}
          />
        </div>
      </div>
    </div>
  );
}
