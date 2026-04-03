# Finance Dashboard

A simple and interactive finance dashboard built with React, Redux Toolkit, and Tailwind CSS. This project demonstrates frontend development skills for tracking financial activities, including summaries, transaction management, and insights.

## Features

- **Dashboard Overview**: Summary cards for total balance, income, and expenses. Visualizations for balance trends and spending breakdowns.
- **Transactions Management**: List of transactions with filtering, sorting, and search. Role-based access for viewing or editing.
- **Insights**: Key metrics like highest spending category, monthly comparisons, and average transactions.
- **Role-Based UI**: Switch between Viewer (read-only) and Admin (full access) roles.
- **Responsive Design**: Works on different screen sizes using Tailwind CSS.

## Tech Stack

- **Frontend**: React 18
- **State Management**: Redux Toolkit (synchronous actions only)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Handling**: date-fns

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repo-url>
   cd finance-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx      # Main dashboard with summaries and charts
│   ├── Transactions.jsx   # Transaction list with filters and CRUD
│   ├── Insights.jsx       # Financial insights and metrics
│   └── RoleSwitcher.jsx   # Role selection dropdown
├── store/
│   ├── index.js           # Redux store configuration
│   └── slices/
│       ├── transactionsSlice.js  # Transactions state
│       ├── filtersSlice.js       # Filtering and sorting state
│       └── roleSlice.js          # User role state
├── App.jsx                # Main app component with navigation
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## Approach and Assumptions

- **State Management**: Used Redux Toolkit for predictable state updates without async thunks, keeping it simple and synchronous.
- **Mock Data**: Initialized with 20 sample transactions for demonstration. All operations update state in real-time.
- **Role Simulation**: Frontend-only role switching; no backend authentication.
- **Data Handling**: Amounts are stored as numbers (positive for income, negative for expenses in display).
- **Edge Cases**: Handles empty data, invalid inputs, and responsive layouts.
- **Performance**: Components re-render on state changes; no optimizations needed for this scale.

## Features in Detail

- **Dashboard**: Calculates totals from transactions. Charts update dynamically.
- **Transactions**: Table view with inline filters. Admin can add/edit/delete via modal.
- **Insights**: Computed metrics from transaction data, focusing on useful observations.

This project showcases clean code, component modularity, and user-friendly design while meeting the assignment requirements.
