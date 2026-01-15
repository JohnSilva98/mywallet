"use client";
import { useState } from "react";

export default function FormGasto({
  onGastoAdicionado,
  gastoParaEditar,
  onCancelar,
}) {
  const [nome, setNome] = useState(gastoParaEditar?.nome || "");
  const [valor, setValor] = useState(gastoParaEditar?.valor || "");
  const [categoria, setCategoria] = useState(gastoParaEditar?.categoria || "");
  const [data, setData] = useState(
    gastoParaEditar?.data
      ? new Date(gastoParaEditar.data).toISOString().split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const gastoData = { nome, valor, categoria, data };

    try {
      if (gastoParaEditar) {
        // Editar
        await fetch(`/api/gastos/${gastoParaEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gastoData),
        });
      } else {
        // Criar novo
        await fetch("/api/gastos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gastoData),
        });
      }

      // Limpar formulário
      setNome("");
      setValor("");
      setCategoria("");
      setData("");

      onGastoAdicionado();
    } catch (error) {
      console.error("Erro ao salvar gasto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {gastoParaEditar ? "Editar Gasto" : "Adicionar Gasto"}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          Nome
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="Ex: Almoço"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          Valor (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="Ex: 50.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          Categoria
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
        >
          <option value="">Selecione...</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Lazer">Lazer</option>
          <option value="Saúde">Saúde</option>
          <option value="Educação">Educação</option>
          <option value="Casa">Casa</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Cultura">Cultura</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading
            ? "Salvando..."
            : gastoParaEditar
            ? "Atualizar"
            : "Adicionar"}
        </button>

        {gastoParaEditar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
