"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ListaGastos({ gastos, onEditar, onDeletar }) {
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

    const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

   const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5800, type: 'receita', date: '22/01/2026', category: 'Salário' },
    { id: 2, description: 'Supermercado', amount: -320, type: 'despesa', date: '21/01/2026', category: 'Alimentação' },
    { id: 3, description: 'Netflix', amount: -45, type: 'despesa', date: '20/01/2026', category: 'Lazer' },
    { id: 4, description: 'Freelance', amount: 1200, type: 'receita', date: '19/01/2026', category: 'Extra' },
    { id: 5, description: 'Gasolina', amount: -180, type: 'despesa', date: '18/01/2026', category: 'Transporte' },
  ];

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
        <h2 className="text-2xl font-bold">Seus Gastos Recentes</h2>
        <p className="text-lg mt-2">
          Total:{" "}
          <span className="font-bold">{formatarValor(calcularTotal())}</span>
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="divide-y">
        {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'receita' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'receita' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${
                  transaction.type === 'receita' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            ))}
          </div>
       
      </div>
    
  );
}
