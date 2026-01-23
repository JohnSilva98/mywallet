"use client";
import { useState, useEffect } from "react";
import FormGasto from "@/components/formGasto";
import ListaGastos from "@/components/listaGasto";
import GraficoCategoria from "@/components/graficoCategorias";
import Header from "@/components/header";

export default function Home() {
  const [saldo, setSaldo] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gastoParaEditar, setGastoParaEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  const calcularSaldo = () => {
    const totalGasto = gastos.reduce((acc, gasto) => acc + Number(gasto.valor || 0), 0);
    const saldoFinal = saldo - totalGasto;
    return saldoFinal;
  };
  
  // Buscar gastos ao carregar a página
  const buscarGastos = async () => {
    try {
      const response = await fetch("/api/gastos");
      const data = await response.json();
      setGastos(data);
      } catch (error) {
      console.error("ERRO PRISMA / DB:", error);
      console.error("Erro ao buscar gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarGastos();
    calcularSaldo();
  }, []);

  const handleGastoAdicionado = () => {
    buscarGastos();
    calcularSaldo();
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
        calcularSaldo();
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
        <p className="text-xl">Carregando..</p>
      </div>
    );
  }   
    const saldoRestante = saldo - gastos.reduce((acc, gasto) => acc + Number(gasto.valor || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
    

        {!mostrarForm && (
          <Header onClick={() => setMostrarForm(true)} />

        )}

        <div className="space-y-6">
          {mostrarForm && (
            <FormGasto
              onGastoAdicionado={handleGastoAdicionado}
              gastoParaEditar={gastoParaEditar}
              onCancelar={handleCancelar}
            />
          )}

          {/* card saldo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Saldo em conta</h2>
            <p className={`text-3xl font-bold ${saldoRestante < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {saldoRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <GraficoCategoria gastos={gastos} />

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
