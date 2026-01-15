"use client";

export default function ListaGastos({ gastos, onEditar, onDeletar }) {
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const calcularTotal = () => {
    // ✅ Proteção contra undefined/null/vazio
    if (!gastos || !Array.isArray(gastos) || gastos.length === 0) {
      return 0;
    }
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
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
      <div className="p-6 bg-blue-600 text-white">
        <h2 className="text-2xl font-bold">Seus Gastos</h2>
        <p className="text-lg mt-2">
          Total:{" "}
          <span className="font-bold">{formatarValor(calcularTotal())}</span>
        </p>
      </div>

      <div className="divide-y">
        {gastos.map((gasto) => (
          <div key={gasto.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {gasto.nome}
                </h3>
                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                  <span className="bg-gray-200 px-2 py-1 rounded">
                    {gasto.categoria}
                  </span>
                  <span>{formatarData(gasto.data)}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-red-600">
                  {formatarValor(gasto.valor)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onEditar(gasto)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeletar(gasto.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
