'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ExpenseType } from '@/lib/types';
import { EXPENSE_CONFIGS } from '@/lib/types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: ExpenseType | null;
  onAdd: (type: ExpenseType, amount: number) => void;
}

export function AddExpenseModal({ isOpen, onClose, selectedType, onAdd }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType && amount) {
      onAdd(selectedType, parseFloat(amount));
      setAmount('');
      onClose();
    }
  };

  const config = selectedType ? EXPENSE_CONFIGS[selectedType] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[340px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {config && <span className="text-2xl">{config.icon}</span>}
            Agregar {config?.label}
          </DialogTitle>
          <DialogDescription>Ingresa el monto del gasto en Bolivianos</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                Bs
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg bg-secondary/50 text-foreground"
                min="0"
                step="0.5"
                autoFocus
              />
            </div>
            {config && (
              <p className="text-xs text-muted-foreground">
                Costo promedio: Bs {config.avgCost}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
