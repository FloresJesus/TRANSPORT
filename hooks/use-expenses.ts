'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Expense, ExpenseType } from '@/lib/types';
import { EXPENSE_CONFIGS } from '@/lib/types';

const STORAGE_KEY = 'movismart-expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch {
        setExpenses([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = useCallback((type: ExpenseType, amount: number) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      type,
      amount,
      date: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByType = expenses.reduce(
    (acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    },
    {} as Record<ExpenseType, number>
  );

  const highestCategory = Object.entries(expensesByType).reduce(
    (max, [type, amount]) => (amount > max.amount ? { type: type as ExpenseType, amount } : max),
    { type: 'taxi' as ExpenseType, amount: 0 }
  );

  const tripCounts = expenses.reduce(
    (acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + 1;
      return acc;
    },
    {} as Record<ExpenseType, number>
  );

  const optimizedSpending = Object.entries(tripCounts).reduce((total, [type, count]) => {
    const expenseType = type as ExpenseType;
    if (expenseType === 'taxi' || expenseType === 'ride') {
      return total + count * EXPENSE_CONFIGS.minibus.avgCost;
    }
    return total + (expensesByType[expenseType] || 0);
  }, 0);

  const potentialSavings = Math.max(0, totalSpent - optimizedSpending);

  const getRecommendation = (): string => {
    if (expenses.length === 0) {
      return 'Empieza a registrar tus gastos para recibir recomendaciones personalizadas.';
    }

    const taxiCount = tripCounts.taxi || 0;
    const rideCount = tripCounts.ride || 0;
    const minibusCount = tripCounts.minibus || 0;

    if (highestCategory.type === 'taxi' && taxiCount > 2) {
      return `Estás usando mucho taxi (${taxiCount} viajes). Podrías ahorrar hasta Bs ${Math.round((taxiCount * EXPENSE_CONFIGS.taxi.avgCost) - (taxiCount * EXPENSE_CONFIGS.minibus.avgCost))} usando minibús.`;
    }

    if (highestCategory.type === 'ride' && rideCount > 2) {
      return `Los ride apps representan tu mayor gasto. Considera usar minibús para rutas frecuentes.`;
    }

    if (minibusCount > taxiCount + rideCount) {
      return '¡Excelente! Estás usando transporte económico. Sigue así para maximizar tu ahorro.';
    }

    return 'Tip: Caminar distancias cortas puede ahorrarte dinero y mejorar tu salud.';
  };

  return {
    expenses,
    isLoaded,
    addExpense,
    deleteExpense,
    clearExpenses,
    totalSpent,
    expensesByType,
    highestCategory,
    tripCounts,
    optimizedSpending,
    potentialSavings,
    getRecommendation,
  };
}
