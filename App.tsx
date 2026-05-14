import { useState, useMemo } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { SpendingPieChart, DailySpendingBarChart } from './components/Charts';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Expense, FilterType, Category } from './types';
import { 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  isWithinInterval, 
  parseISO, 
  format, 
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { LayoutDashboard, Wallet, Calendar, Filter, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('receipts_data', []);
  const [filter, setFilter] = useState<FilterType>('this_week');

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses([expense, ...expenses]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    if (filter === 'all_time') return expenses;

    const start = filter === 'this_week' 
      ? startOfWeek(now, { weekStartsOn: 1 }) 
      : startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    
    const end = filter === 'this_week'
      ? endOfWeek(now, { weekStartsOn: 1 })
      : endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    return expenses.filter(e => {
      const date = parseISO(e.date);
      return isWithinInterval(date, { start, end });
    });
  }, [expenses, filter]);

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [filteredExpenses]);

  const barData = useMemo(() => {
    const now = new Date();
    const last7Days = eachDayOfInterval({
      start: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      end: now
    });

    return last7Days.map(day => {
      const amount = expenses
        .filter(e => isSameDay(parseISO(e.date), day))
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      return {
        date: format(day, 'MMM dd'),
        amount
      };
    });
  }, [expenses]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Receipts
          </h1>
          <p className="text-white/50 flex items-center gap-2 mt-1">
            <LayoutDashboard size={16} /> A Spender's Dashboard
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 self-start">
          {(['this_week', 'last_week', 'all_time'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                filter === f 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              {f.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-500/20 rounded-2xl text-violet-400">
                <Wallet size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400/70">Total Spend</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Spending trend is stable</span>
            </div>
          </motion.div>

          <ExpenseForm onAdd={addExpense} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Calendar className="text-fuchsia-500" /> Spending by Category
              </h3>
              {pieData.length > 0 ? (
                <SpendingPieChart data={pieData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-white/20 italic">
                  No data for this period
                </div>
              )}
            </motion.div>

            {/* Daily Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Filter className="text-cyan-500" /> Last 7 Days
              </h3>
              <DailySpendingBarChart data={barData} />
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <History className="text-violet-500" /> Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white/30 text-sm border-b border-white/10">
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((e) => (
                        <motion.tr 
                          key={e.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 text-white/70">{format(parseISO(e.date), 'MMM dd, yyyy')}</td>
                          <td className="py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider",
                              e.category === 'food' && "bg-rose-500/20 text-rose-400",
                              e.category === 'transport' && "bg-sky-500/20 text-sky-400",
                              e.category === 'data' && "bg-violet-500/20 text-violet-400",
                              e.category === 'fun' && "bg-amber-500/20 text-amber-400",
                              e.category === 'other' && "bg-emerald-500/20 text-emerald-400",
                            )}>
                              {e.category}
                            </span>
                          </td>
                          <td className="py-4 text-white/50">{e.description || '-'}</td>
                          <td className="py-4 text-right font-bold text-white">
                            ${e.amount.toFixed(2)}
                            <button 
                              onClick={() => deleteExpense(e.id)}
                              className="ml-4 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 transition-opacity"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-white/20 italic">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
