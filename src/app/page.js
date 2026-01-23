"use client";
import { useState, useEffect } from "react";
import FormGasto from "@/components/novaTransacao";
import ListaGastos from "@/components/listaGasto";
import GraficoCategoria from "@/components/graficoCategorias";
import Header from "@/components/header";
import { Wallet, TrendingDown,TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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

  // Dados de exemplo
  const monthlyData = [
    { mes: 'Jul', receitas: 4500, despesas: 3200 },
    { mes: 'Ago', receitas: 5200, despesas: 3800 },
    { mes: 'Set', receitas: 4800, despesas: 3500 },
    { mes: 'Out', receitas: 4000, despesas: 4200 },
    { mes: 'Nov', receitas: 6000, despesas: 4500 },
    { mes: 'Dez', receitas: 5800, despesas: 4100 },
  ];

  const categoryData = [
    { name: 'Alimentação', value: 1200, color: '#3b82f6' },
    { name: 'Transporte', value: 800, color: '#8b5cf6' },
    { name: 'Moradia', value: 1500, color: '#ec4899' },
    { name: 'Lazer', value: 600, color: '#f59e0b' },
    { name: 'Outros', value: 500, color: '#10b981' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5800, type: 'receita', date: '22/01/2026', category: 'Salário' },
    { id: 2, description: 'Supermercado', amount: -320, type: 'despesa', date: '21/01/2026', category: 'Alimentação' },
    { id: 3, description: 'Netflix', amount: -45, type: 'despesa', date: '20/01/2026', category: 'Lazer' },
    { id: 4, description: 'Freelance', amount: 1200, type: 'receita', date: '19/01/2026', category: 'Extra' },
    { id: 5, description: 'Gasolina', amount: -180, type: 'despesa', date: '18/01/2026', category: 'Transporte' },
  ];

  const stats = {
    balance: 8450.50,
    income: 5800,
    expenses: 4100,
    savings: 1700
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <div className=" rounded-lg shadow p-6 bg-gray-50">
            <div className="flex items-center gap-2 ">
              <Wallet className="w-8 h-8 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-800">Saldo em conta</h2>
            </div>
            <p className={`text-3xl font-bold ${saldoRestante < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {saldoRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* card despesas */}
          <div className=" rounded-lg shadow p-6 bg-gray-50">
            <div className="flex items-center gap-2 ">
              <TrendingDown className="w-10 h-10 text-red-600 bg-red-100 p-2 rounded-lg" />
              <h2 className="text-2xl font-bold text-gray-800">Despesas do mês</h2>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {gastos.reduce((acc, gasto) => acc + Number(gasto.valor || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* receitas vs despesas */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className=" bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Receitas vs Despesas</h2>
              <select className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
                <option>Últimos 6 meses</option>
                <option>Últimos 12 meses</option>
                <option>Este ano</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}> {/* recebe os dados de um array/api */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" /> {/* eixo horizontal */}
                <YAxis stroke="#64748b" /> {/* eixo vertical */}
                <Tooltip 
                  contentStyle={{ /* css do grafico */
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value) => formatCurrency(value)} 
                />
                <Legend />
                {/*  linha de receitas */}
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Receitas"
                />
                {/* linha de despesas */}
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
            
          </div>
           {/* grafico despesas por categoria */}
          <GraficoCategoria gastos={gastos} />
        </div>

         

          {/* lista de gastos recentes */}
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
