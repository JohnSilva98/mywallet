"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function GraficoCategoria({ gastos }) {
  // Agrupar gastos por categoria e somar valores
  const dadosPorCategoria = gastos.reduce((acc, gasto) => {
    const categoria = gasto.categoria;
    const valor = Number(gasto.valor);

    if (acc[categoria]) {
      acc[categoria] += valor;
    } else {
      acc[categoria] = valor;
    }

    return acc;
  }, {});

  // Transformar em array para o gráfico
  const dados = Object.entries(dadosPorCategoria).map(([name, value]) => ({
    name,
    value,
  }));

  // Calcular total para porcentagens
  const total = dados.reduce((sum, item) => sum + item.value, 0);

  // Cores para cada categoria
  const CORES = {
    Alimentação: "#FF6384",
    Transporte: "#36A2EB",
    Lazer: "#FFCE56",
    Saúde: "#4BC0C0",
    Educação: "#9966FF",
    Outros: "#FF9F40",
  };

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const porcentagem = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">{porcentagem}% do total</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar label customizado
  const renderLabel = (entry) => {
    const porcentagem = ((entry.value / total) * 100).toFixed(1);
    return `${porcentagem}%`;
  };

  if (gastos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Adicione gastos para ver o gráfico
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Gastos por Categoria
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CORES[entry.name] || "#999"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
