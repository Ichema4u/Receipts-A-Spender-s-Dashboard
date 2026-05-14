# 01 - ELI7 Code Explanation: Receipts Dashboard (Updated)

Welcome to the inner workings of your spending dashboard! Here is a line-by-line breakdown of how we manage your money data.

## The Core: App.tsx

### 1. State and Storage
```typescript
const [expenses, setExpenses] = useLocalStorage<Expense[]>('receipts_data', []);
const [filter, setFilter] = useState<FilterType>('this_week');
```
- **Line 1**: We grab your list of receipts from the browser's "memory bank" (`localStorage`). 
- **ESM Detail**: We use `import type` for our interfaces. This tells the browser, "Hey, this is just a label for TypeScript, you don't need to look for a real file named 'Category' at runtime!"

### 2. Adding Data (Non-Mutating)
- Instead of "pushing" into the old list (which changes the original), we create a **brand new list**.
- We put the new receipt at the front `[expense, ...]` and then add all the old ones after it.

### 3. Filtering Without Destroying
- We use `.filter()`. This function looks at the original list and creates a **filtered copy**. The original list remains untouched.
- `useMemo` is like a smart brain that remembers the result. It only recalculates if you add a new expense or change the filter button.

### 4. Data Shaping for Charts
**The Pie Chart (Categories):**
- We create a "tally sheet" (Object).
- We turn that tally sheet into a list of `{ name, value }` pairs that the Donut chart can draw.

**The Bar Chart (7-Day History):**
- We generate a list of the last 7 calendar days.
- We sum them up and create a "Bar" for that day.
- **Fix**: We added a `min-height` to the chart containers so they don't look "squashed" when they first load.

## Styling: index.css
- **Tailwind 4**: We use the new `@theme` at-rule. Because it's so new, your code editor might get confused, so we added a special settings file to tell it to stay calm.
- **Glassmorphism**: We use `backdrop-filter` to give that "frosted glass" look.
