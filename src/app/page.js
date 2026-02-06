"use client";
import { useState, useEffect } from "react";
import ListaGastos from "../components/listaGasto";
import GraficoCategoria from "../components/graficoCategorias";
import Header from "../components/header";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  // ✅ 1. TODOS os hooks no início
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gastos, setGastos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gastoParaEditar, setGastoParaEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodoGrafico, setPeriodoGrafico] = useState('6meses');

  // ✅ 2. Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === "loading") return; // Ainda carregando
    
    if (!session) {
      router.push('/login');
      return;
    }
  }, [status, session, router]);

  const buscarGastos = async () => {
    try {
      const response = await fetch("/api/gastos");
      
      if (!response.ok) {
        console.error("Erro na API:", response.status);
        setGastos([]);
        return;
      }
      
      const data = await response.json();
      
      // Verificar se data é um array, caso contrário usar array vazio
      if (Array.isArray(data)) {
        setGastos(data);
      } else {
        console.error("API não retornou um array:", data);
        setGastos([]);
      }
    } catch (error) {
      console.error("ERRO PRISMA / DB:", error);
      console.error("Erro ao buscar gastos:", error);
      setGastos([]); // Garantir que gastos seja sempre um array
    }
  };

  // ✅ 2. useEffect ANTES de qualquer if/return
  useEffect(() => {
    if (session) {
      buscarGastos();
    }
  }, [session]);

  // ✅ 3. AGORA SIM pode usar if/return
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }


  // ✅ 4. Funções e cálculos DEPOIS dos returns condicionais
  const totalReceitas = gastos
    .filter(item => item.tipo === 'receita')
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const totalDespesas = gastos
    .filter(item => item.tipo === 'despesa')
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const saldoAtual = totalReceitas - totalDespesas;

  const processarDadosGrafico = () => {
    const agora = new Date();
    let dataInicio;
    
    switch(periodoGrafico) {
      case '6meses':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 6, 1);
        break;
      case '12meses':
        dataInicio = new Date(agora.getFullYear() - 1, agora.getMonth(), 1);
        break;
      case 'ano':
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 6, 1);
    }
    
    const gastosFiltrados = gastos.filter(gasto => 
      new Date(gasto.data) >= dataInicio
    );
    
    const dadosPorMes = {};
    
    gastosFiltrados.forEach(gasto => {
      const data = new Date(gasto.data);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      const nomeMes = data.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!dadosPorMes[mesAno]) {
        dadosPorMes[mesAno] = {
          mes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
          receitas: 0,
          despesas: 0
        };
      }
      
      if (gasto.tipo === 'receita') {
        dadosPorMes[mesAno].receitas += Number(gasto.valor);
      } else {
        dadosPorMes[mesAno].despesas += Number(gasto.valor);
      }
    });
    
    return Object.values(dadosPorMes)
      .sort((a, b) => {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return meses.indexOf(a.mes) - meses.indexOf(b.mes);
      })
      .slice(-6);
  };
  
  const monthlyData = processarDadosGrafico();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

 

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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bem vindo, {session?.user?.name}</h1>
            <button
              onClick={() => signOut({callbackUrl: '/login'})}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer text-sm sm:text-base whitespace-nowrap"
            >
              Sair
            </button>
          </div>

          <div className="rounded-lg shadow p-6 bg-gray-50">
            <div className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-800">Saldo em conta</h2>
            </div>
            <p className={`text-3xl font-bold ${saldoAtual < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* card despesas */}
          <div className="rounded-lg shadow p-6 bg-gray-50">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-10 h-10 text-red-600 bg-red-100 p-2 rounded-lg" />
              <h2 className="text-2xl font-bold text-gray-800">Despesas do mês</h2>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* receitas vs despesas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Receitas vs Despesas</h2>
                <select 
                  className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  value={periodoGrafico}
                  onChange={(e) => setPeriodoGrafico(e.target.value)}
                >
                  <option value="6meses">Últimos 6 meses</option>
                  <option value="12meses">Últimos 12 meses</option>
                  <option value="ano">Este ano</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                    formatter={(value) => formatCurrency(value)} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Receitas"
                  />
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
            
            <GraficoCategoria gastos={gastos} />
          </div>

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