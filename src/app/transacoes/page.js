"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Search, Filter, Calendar } from "lucide-react";

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("data-desc");

  // Buscar transações ao carregar a página
  const buscarTransacoes = async () => {
    try {
      const response = await fetch("/api/gastos");
      const data = await response.json();
      setTransacoes(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTransacoes();
  }, []);

  // Formatar data
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Formatar moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };

  // Filtrar transações
  const transacoesFiltradas = transacoes
    .filter(transacao => {
      const filtroTipoMatch = filtroTipo === "todos" || transacao.tipo === filtroTipo;
      const buscaMatch = transacao.nome.toLowerCase().includes(busca.toLowerCase()) ||
                         transacao.categoria.toLowerCase().includes(busca.toLowerCase());
      return filtroTipoMatch && buscaMatch;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "data-desc":
          return new Date(b.data) - new Date(a.data);
        case "data-asc":
          return new Date(a.data) - new Date(b.data);
        case "valor-desc":
          return Number(b.valor) - Number(a.valor);
        case "valor-asc":
          return Number(a.valor) - Number(b.valor);
        default:
          return 0;
      }
    });

  // Calcular totais
  const totais = transacoesFiltradas.reduce(
    (acc, transacao) => {
      const valor = Number(transacao.valor);
      if (transacao.tipo === "receita") {
        acc.receitas += valor;
      } else {
        acc.despesas += valor;
      }
      acc.saldo = acc.receitas - acc.despesas;
      return acc;
    },
    { receitas: 0, despesas: 0, saldo: 0 }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Carregando transações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Todas as Transações</h1>
              <p className="text-gray-600 mt-1">
                {transacoesFiltradas.length} transação{transacoesFiltradas.length !== 1 ? "ões" : ""} encontrada{transacoesFiltradas.length !== 1 ? "s" : ""}
              </p>
            </div>
            <a 
              href="/"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Voltar ao Dashboard
            </a>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(totais.receitas)}
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatarMoeda(totais.despesas)}
                </p>
              </div>
              <ArrowDownRight className="w-8 h-8 text-red-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${totais.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatarMoeda(totais.saldo)}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                totais.saldo >= 0 ? "bg-green-100" : "bg-red-100"
              }`}>
                <span className={`text-lg font-bold ${totais.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totais.saldo >= 0 ? "R$" : "R$"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou categoria..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os tipos</option>
              <option value="receita">Apenas receitas</option>
              <option value="despesa">Apenas despesas</option>
            </select>

            {/* Ordenação */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="data-desc">Mais recentes primeiro</option>
              <option value="data-asc">Mais antigas primeiro</option>
              <option value="valor-desc">Maior valor primeiro</option>
              <option value="valor-asc">Menor valor primeiro</option>
            </select>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {transacoesFiltradas.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma transação encontrada</p>
              <p className="text-sm mt-2">Tente ajustar os filtros ou adicionar novas transações</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transacoesFiltradas.map((transacao) => (
                <div
                  key={transacao.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transacao.tipo === "receita"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transacao.tipo === "receita" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transacao.nome}</p>
                        <p className="text-sm text-gray-500">
                          {transacao.categoria} • {formatarData(transacao.data)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transacao.tipo === "receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transacao.tipo === "receita" ? "+" : "-"}
                        {formatarMoeda(Math.abs(Number(transacao.valor)))}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          transacao.tipo === "receita"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
