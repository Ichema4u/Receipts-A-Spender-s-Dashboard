import { useState } from 'react';
import type { Category, Expense } from '../types';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAdd({
      amount: Number(amount),
      category,
      date,
      description
    });

    setAmount('');
    setDescription('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PlusCircle className="text-violet-500" /> Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-white/50 ml-1">Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/50 ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="input-field w-full appearance-none"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="data">Data</option>
              <option value="fun">Fun</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-white/50 ml-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/50 ml-1">Description (Optional)</label>
            <input
              type="text"
              placeholder="What was it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Add to Dashboard
        </button>
      </form>
    </motion.div>
  );
}
