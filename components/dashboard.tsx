'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddExpenseModal } from './add-expense-modal';
import { ExpenseChart } from './expense-chart';
import { useExpenses } from '@/hooks/use-expenses';
import type { ExpenseType } from '@/lib/types';
import { EXPENSE_CONFIGS } from '@/lib/types';
import { Trash2, LogOut, TrendingDown, Wallet, Lightbulb, History } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedType, setSelectedType] = useState<ExpenseType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    expenses,
    isLoaded,
    addExpense,
    deleteExpense,
    totalSpent,
    expensesByType,
    optimizedSpending,
    potentialSavings,
    getRecommendation,
  } = useExpenses();

  const handleAddClick = (type: ExpenseType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const recentExpenses = expenses.slice(0, 5);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">MoviSmart</h1>
            <p className="text-xs text-muted-foreground">Tus gastos de transporte</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-muted-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
          <CardContent className="pt-6 pb-4">
            <div className="text-center">
              <p className="text-sm text-emerald-300 mb-1">Total Gastado</p>
              <p className="text-4xl font-bold text-foreground">
                Bs {totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {expenses.length} viajes registrados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Buttons */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agregar Gasto
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-4 gap-2">
              {Object.values(EXPENSE_CONFIGS).map((config) => (
                <Button
                  key={config.type}
                  variant="outline"
                  className="flex flex-col h-auto py-3 px-2 border-border/50 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                  onClick={() => handleAddClick(config.type)}
                >
                  <span className="text-2xl mb-1">{config.icon}</span>
                  <span className="text-xs text-muted-foreground">{config.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Distribución de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart expensesByType={expensesByType} />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Wallet className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gasto Actual</p>
                  <p className="text-lg font-semibold text-foreground">Bs {totalSpent.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ahorro Potencial</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    Bs {potentialSavings.toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendation Card */}
        <Card className="border-border/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 h-fit">
                <Lightbulb className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-300 font-medium mb-1">Recomendación Inteligente</p>
                <p className="text-sm text-foreground">{getRecommendation()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Card */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comparación de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gasto Actual</span>
                <span className="text-sm font-medium text-foreground">Bs {totalSpent.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: totalSpent > 0 ? '100%' : '0%' }}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">Gasto Optimizado</span>
                <span className="text-sm font-medium text-emerald-400">
                  Bs {optimizedSpending.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: totalSpent > 0 ? `${(optimizedSpending / totalSpent) * 100}%` : '0%',
                  }}
                />
              </div>

              {potentialSavings > 0 && (
                <p className="text-xs text-center text-emerald-400 mt-2">
                  ¡Podrías ahorrar Bs {potentialSavings.toFixed(2)} optimizando tus viajes!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay gastos registrados
              </p>
            ) : (
              <div className="space-y-2">
                {recentExpenses.map((expense) => {
                  const config = EXPENSE_CONFIGS[expense.type];
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{config.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{config.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('es-BO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          Bs {expense.amount.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive-foreground hover:text-destructive-foreground hover:bg-destructive/20 transition-opacity"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedType={selectedType}
        onAdd={addExpense}
      />
    </div>
  );
}
