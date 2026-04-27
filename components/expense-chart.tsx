'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { ExpenseType } from '@/lib/types';
import { EXPENSE_CONFIGS } from '@/lib/types';

interface ExpenseChartProps {
  expensesByType: Record<ExpenseType, number>;
}

export function ExpenseChart({ expensesByType }: ExpenseChartProps) {
  const data = Object.entries(expensesByType)
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => ({
      name: EXPENSE_CONFIGS[type as ExpenseType].label,
      value: amount,
      color: EXPENSE_CONFIGS[type as ExpenseType].color,
      icon: EXPENSE_CONFIGS[type as ExpenseType].icon,
    }));

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
        <span className="text-4xl mb-2">📊</span>
        <p className="text-sm">Sin datos aún</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-[140px] h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-foreground">{item.icon} {item.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">Bs {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
