# 06 - The Lie Detector

Here are five statements about the Receipts Dashboard code. One of them is a lie.

1.  **The Persistence**: The app uses a custom hook `useLocalStorage` that synchronizes state with the browser's storage on every change.
2.  **The Charts**: The Bar Chart dynamically generates a 7-day range based on the current date, ensuring there are no missing days even if no spending occurred.
3.  **The Filtering**: When you switch to "Last Week", the app creates a copy of the expenses list and removes all other items from memory to save RAM.
4.  **The Styling**: The glassmorphism effect is achieved using a combination of `backdrop-filter: blur()` and a semi-transparent background color.
5.  **The Categories**: If you add an expense with a category not in the predefined list (e.g., 'rent'), the app will still show it in the table but won't assign it a specific color pill.

---

## The Reveal

**The Lie is Statement #3.**

### The Proof
Look at the `App.tsx` code:
```typescript
const filteredExpenses = useMemo(() => {
  // ... logic ...
  return expenses.filter(e => {
    const date = parseISO(e.date);
    return isWithinInterval(date, { start, end });
  });
}, [expenses, filter]);
```

### The Reasoning
Statement #3 says we "remove other items from memory to save RAM". This is **FALSE**.
-   The original `expenses` list (the "Single Source of Truth") stays perfectly intact in memory.
-   `filteredExpenses` is just a **view** (a new reference to a subset of existing objects).
-   JavaScript's Garbage Collector doesn't delete the other items because they are still being held by the main `expenses` state variable.
-   This is actually a **good thing**! It's why switching filters is instant. If we "removed them from memory", we'd have to reload them from the slow LocalStorage every time you clicked a button.

---

### AI's Final Audit
The code is a textbook example of **Immutability**. We never destroy; we only create new perspectives on the same data.
