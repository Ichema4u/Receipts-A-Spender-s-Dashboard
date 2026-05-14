# 04 - Deep Dive: Data Shaping for Visuals

Models often skip the "ugly" parts of data shaping. Let's look at the complexity hidden behind the simplicity.

## The "Scanning" Problem in Bar Charts
Most AI-generated charts just map over an array and hope the dates align. Our approach is **Calendar-First**, not Data-First.

### Why this matters:
If you only have expenses on Monday and Wednesday, a simple `expenses.map()` would show two bars side-by-side. Our code creates a "Virtual Calendar" of 7 days first, then fills in the gaps:

```typescript
const last7Days = eachDayOfInterval({
  start: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
  end: now
});

return last7Days.map(day => {
  const amount = expenses
    .filter(e => isSameDay(parseISO(e.date), day))
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  return { date: format(day, 'MMM dd'), amount };
});
```

### The Fix for "Zero-Size" Errors:
Vite and Recharts sometimes complain if a `ResponsiveContainer` starts with a height of 0px before the CSS loads. We mitigated this by adding `min-h-[256px]` to all chart wrappers, ensuring a stable "placeholder" space while the layout calculates.

### The Complexity Breakdown:
1.  **Interval Generation**: We use `eachDayOfInterval` to ensure we have exactly 7 slots, even if you spent $0 on those days.
2.  **Double-Loop Logic**: For every day (7), we iterate through every expense (N). This is an $O(7 * N)$ operation. 
    *   *Optimization Note*: If N was 100,000, we would pre-index the expenses by date into a Hash Map first to reduce this to $O(N)$.
3.  **Date Normalization**: `parseISO(e.date)` is critical. Date strings in JSON are just text; converting them back to Date objects at the right moment ensures `isSameDay` works regardless of the user's local time string format.

## The "Reducer" Logic in Pie Charts
Grouping data is a classic "Reduction" problem. 

```typescript
const categories: Record<string, number> = {};
filteredExpenses.forEach(e => {
  categories[e.category] = (categories[e.category] || 0) + e.amount;
});
```
-   **Initial State**: `{}` (Empty Object).
-   **Step**: Look at category "Food". Is it in the object? No? Start at 0. Add $10.
-   **Next Step**: Look at category "Food" again. It's there! Add another $5. Now it's 15.
-   **Result**: A clean tally.

### The Conversion Step:
Recharts expects an **Array of Objects**, but we built an **Object of Tallies**.
`Object.entries(categories).map(...)` bridges this gap. It turns `{"food": 15}` into `[{name: "Food", value: 15}]`.

## Performance Summary
By using `useMemo`, we ensure that these intensive calculations only happen when the underlying data changes, not every time the user types in a search box or clicks a unrelated menu item. This is the difference between a "laggy" dashboard and a "pro" dashboard.
