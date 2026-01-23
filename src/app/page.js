"use client";
import { useState, useEffect } from "react";
import ListaGastos from "@/components/listaGasto";
import GraficoCategoria from "@/components/graficoCategorias";
import Header from "@/components/header";
import { Wallet, TrendingDown,TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Home() {
  
  const [gastos, setGastos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gastoParaEditar, setGastoParaEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodoGrafico, setPeriodoGrafico] = useState('6meses');


  const totalReceitas = gastos
  .filter(item => item.tipo === 'receita')
  .reduce((acc, item) => acc + Number(item.valor || 0), 0);

const totalDespesas = gastos
  .filter(item => item.tipo === 'despesa')
  .reduce((acc, item) => acc + Number(item.valor || 0), 0);

const saldoAtual = totalReceitas - totalDespesas;

  

  // Função para processar dados do gráfico por período
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
    
    // Filtrar gastos por período
    const gastosFiltrados = gastos.filter(gasto => 
      new Date(gasto.data) >= dataInicio
    );
    
    // Agrupar por mês
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
    
    // Ordenar por data e converter para array
    return Object.values(dadosPorMes)
      .sort((a, b) => {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return meses.indexOf(a.mes) - meses.indexOf(b.mes);
      })
      .slice(-6); // Últimos 6 meses para visualização
  };
  
  const monthlyData = processarDadosGrafico();


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
        <p className="text-xl">Carregando..</p>
      </div>
    );
  }   
    

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
            <p className={`text-3xl font-bold ${saldoAtual < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* card despesas */}
          <div className=" rounded-lg shadow p-6 bg-gray-50">
            <div className="flex items-center gap-2 ">
              <TrendingDown className="w-10 h-10 text-red-600 bg-red-100 p-2 rounded-lg" />
              <h2 className="text-2xl font-bold text-gray-800">Despesas do mês</h2>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* receitas vs despesas */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className=" bg-white rounded-2xl p-6 shadow-md border border-slate-200">
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
