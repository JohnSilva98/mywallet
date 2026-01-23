"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ListaGastos({ gastos, onEditar, onDeletar }) {
  // Ordenar por data (mais recentes primeiro) e pegar apenas os 4 primeiros
  const gastosRecentes = gastos
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 4);
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

    const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };


  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const calcularTotal = () => {
    if (!gastos || !Array.isArray(gastos) || gastos.length === 0) {
      return 0;
    }
    // ✅ Number() ou parseFloat() converte string → número
    return gastos.reduce((total, gasto) => total + Number(gasto.valor), 0);
  };
  if (gastos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Nenhum gasto cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 text-black">
        <h2 className="text-2xl font-bold">Suas transações recentes</h2>
        <p className="text-lg mt-2">
          Total:{" "}
          <span className="font-bold">{formatarValor(calcularTotal())}</span>
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="divide-y">
        {gastosRecentes.map((gasto) => (
              <div 
                key={gasto.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    gasto.tipo === 'receita' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {gasto.tipo === 'receita' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{gasto.nome}</p>
                    <p className="text-sm text-slate-500">{gasto.categoria} • {formatarData(gasto.data)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-bold text-lg ${
                    gasto.tipo === 'receita' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {gasto.tipo === 'receita' ? '+' : '-'}{formatarValor(Math.abs(Number(gasto.valor)))}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditar(gasto)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeletar(gasto.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
       
      </div>
    
  );
}
