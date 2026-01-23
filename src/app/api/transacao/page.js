'use client';

import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, Tag, FileText, TrendingUp, TrendingDown, Wallet, CreditCard, Repeat, X } from 'lucide-react';
import Link from 'next/link';

const novaTransacao = () => {
  const [transactionType, setTransactionType] = useState('despesa');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    account: 'principal',
    isRecurring: false,
    notes: ''
  });

  const categories = {
    despesa: [
      { value: 'alimentacao', label: 'Alimentação', icon: '🍔' },
      { value: 'transporte', label: 'Transporte', icon: '🚗' },
      { value: 'moradia', label: 'Moradia', icon: '🏠' },
      { value: 'saude', label: 'Saúde', icon: '🏥' },
      { value: 'educacao', label: 'Educação', icon: '📚' },
      { value: 'lazer', label: 'Lazer', icon: '🎮' },
      { value: 'compras', label: 'Compras', icon: '🛍️' },
      { value: 'outros', label: 'Outros', icon: '📦' }
    ],
    receita: [
      { value: 'salario', label: 'Salário', icon: '💼' },
      { value: 'freelance', label: 'Freelance', icon: '💻' },
      { value: 'investimentos', label: 'Investimentos', icon: '📈' },
      { value: 'vendas', label: 'Vendas', icon: '💰' },
      { value: 'outros', label: 'Outros', icon: '📦' }
    ]
  };

  const accounts = [
    { value: 'principal', label: 'Conta Principal', icon: '🏦' },
    { value: 'poupanca', label: 'Poupança', icon: '🐷' },
    { value: 'cartao', label: 'Cartão de Crédito', icon: '💳' }
  ];

  const handleSubmit = () => {
    console.log('Transação criada:', { ...formData, type: transactionType });
    // Aqui você faria a chamada à API
  };

  const formatCurrencyInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    const amount = Number(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormData({ ...formData, amount: formatted });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <Link href="/">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </Link>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Nova Transação</h1>
              <p className="text-sm text-slate-500">Adicione uma receita ou despesa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Tipo de Transação */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Tipo de Transação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTransactionType('despesa')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  transactionType === 'despesa'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transactionType === 'despesa' ? 'bg-red-100' : 'bg-slate-100'
                  }`}>
                    <TrendingDown className={`w-6 h-6 ${
                      transactionType === 'despesa' ? 'text-red-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${
                      transactionType === 'despesa' ? 'text-red-700' : 'text-slate-600'
                    }`}>
                      Despesa
                    </p>
                    <p className="text-xs text-slate-500">Saída de dinheiro</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType('receita')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  transactionType === 'receita'
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transactionType === 'receita' ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${
                      transactionType === 'receita' ? 'text-green-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${
                      transactionType === 'receita' ? 'text-green-700' : 'text-slate-600'
                    }`}>
                      Receita
                    </p>
                    <p className="text-xs text-slate-500">Entrada de dinheiro</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Valor */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Valor
            </label>
            <div className="relative text-black">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-4 text-3xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Descrição
            </label>
            <div className="relative text-black">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Supermercado, Salário, Netflix..."
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories[transactionType].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                    formData.category === cat.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{cat.icon}</div>
                  <p className={`text-xs font-medium ${
                    formData.category === cat.value ? 'text-blue-700' : 'text-slate-600'
                  }`}>
                    {cat.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Data e Conta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Data */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Data
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conta */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Conta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wallet className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.value} value={acc.value}>
                      {acc.icon} {acc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transação Recorrente */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Repeat className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Transação Recorrente</p>
                  <p className="text-sm text-slate-500">Repete mensalmente</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-6 h-6 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Notas (Opcional) */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Notas (Opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações sobre esta transação..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex-1 px-6 py-4 rounded-xl font-medium text-white transition-all hover:shadow-lg ${
                transactionType === 'despesa'
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
            >
              Adicionar {transactionType === 'despesa' ? 'Despesa' : 'Receita'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default novaTransacao;