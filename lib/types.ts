export type ExpenseType = 'taxi' | 'minibus' | 'walking' | 'ride';

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  date: string;
}

export interface ExpenseConfig {
  type: ExpenseType;
  label: string;
  icon: string;
  color: string;
  avgCost: number;
}

export const EXPENSE_CONFIGS: Record<ExpenseType, ExpenseConfig> = {
  taxi: {
    type: 'taxi',
    label: 'Taxi',
    icon: '🚕',
    color: '#f59e0b',
    avgCost: 25,
  },
  minibus: {
    type: 'minibus',
    label: 'Minibus',
    icon: '🚌',
    color: '#10b981',
    avgCost: 3,
  },
  walking: {
    type: 'walking',
    label: 'Caminando',
    icon: '🚶',
    color: '#06b6d4',
    avgCost: 0,
  },
  ride: {
    type: 'ride',
    label: 'Ride App',
    icon: '📱',
    color: '#8b5cf6',
    avgCost: 20,
  },
};
