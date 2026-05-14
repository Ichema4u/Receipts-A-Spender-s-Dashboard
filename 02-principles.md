# 02 - Architectural Principle Spotting

This application follows modern React best practices to ensure stability and performance.

## 1. Derived State (Calculation vs. Storage)
**Where**: `filteredExpenses`, `totalSpend`, `pieData`, `barData`.
**Principle**: Instead of storing the "Total" or the "Filtered List" in separate `useState` variables, we calculate them from the single source of truth (`expenses`).
**Benefit**: This prevents "Out-of-sync" bugs. You can't have a total that doesn't match the list because the total *is* the list.

## 2. Pure Functions for Filtering
**Where**: `expenses.filter(e => isWithinInterval(...))`
**Principle**: The filtering logic doesn't modify the `expenses` array. It takes an input and returns a new output without "Side Effects".
**Benefit**: Makes the code predictable and easier to test.

## 3. Separation of Data and Presentation
**Where**: `Charts.tsx` vs `App.tsx`.
**Principle**: `Charts.tsx` doesn't know about "Expenses" or "Local Storage". It only knows about generic data shapes like `{ name: string, value: number }`. 
**Benefit**: You could replace the entire expense system with a "Calorie Tracker", and the Charts would still work without changing a single line of chart code.

## 4. Immutability
**Where**: `setExpenses([expense, ...expenses])`.
**Principle**: We never use `.push()` or `.splice()`. We always create a fresh copy of the array.
**Benefit**: React depends on "Reference Changes" to know when to re-render. If you mutate an array in place, React might not realize anything changed and the UI won't update.

## 5. Single Source of Truth
**Where**: The `receipts_data` key in LocalStorage.
**Principle**: Every piece of information on the screen flows from this one array. 
**Benefit**: Deleting one item from the master list automatically updates the total, the donut chart, the bar chart, and the table instantly.

## 6. Declarative UI
**Where**: The entire JSX structure.
**Principle**: We describe *what* the UI should look like for a given state (e.g., "Show this if data exists, otherwise show a message"), rather than *how* to change it (e.g., "Find this div and hide it").
**Benefit**: Drastically reduces code complexity.
