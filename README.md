# Finance Dashboard

A modern, responsive finance dashboard built with React, Redux Toolkit, and Tailwind CSS. This project showcases advanced frontend development skills including state management, data visualization, role-based access control, and professional UI design.

## ✨ Features

### Dashboard Overview
- **Summary Cards**: Total balance, monthly income, and expenses with trend indicators
- **Interactive Charts**: Balance trend line chart and spending breakdown pie chart
- **Real-time Updates**: All metrics update dynamically based on transaction data

### Transactions Management
- **Comprehensive Table**: Sortable and filterable transaction list with pagination
- **Advanced Filtering**: Filter by category, type (income/expense), date range, and search
- **CRUD Operations**: Add, edit, and delete transactions (Admin role only)
- **Modal Forms**: Clean, accessible forms for transaction management

### Insights & Analytics
- **Key Metrics**: Highest spending category, income/expense trends, average transaction value
- **Savings Rate**: Calculated net savings percentage
- **Visual Indicators**: Color-coded metrics with trend arrows

### User Experience
- **Role-Based Access**: Switch between Viewer (read-only) and Admin (full access) roles
- **Dark Mode**: Complete dark/light theme toggle with localStorage persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Card-based layout with subtle shadows, hover effects, and smooth transitions

### Technical Features
- **Global Color System**: Four customizable CSS variables for easy theming
- **State Management**: Redux Toolkit with separate slices for transactions, filters, and roles
- **Mock Data**: 20 sample transactions for demonstration
- **Type Safety**: Well-structured components with consistent prop handling

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with Hooks
- **State Management**: Redux Toolkit (synchronous actions)
- **Styling**: Tailwind CSS with custom color variables
- **Charts & Visualization**: Recharts library
- **Date Handling**: date-fns for formatting and calculations
- **Build Tool**: Vite for fast development and optimized production builds
- **Icons**: Unicode emojis for lightweight, accessible iconography

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx           # Main app with sidebar navigation and layout
│   ├── Dashboard.jsx     # Dashboard overview with cards and charts
│   ├── Transactions.jsx  # Transaction management with table and forms
│   ├── Insights.jsx      # Financial insights and metrics grid
│   └── RoleSwitcher.jsx  # Role selection component
├── store/
│   ├── index.js          # Redux store configuration
│   └── slices/
│       ├── transactionsSlice.js  # Transaction state management
│       ├── filtersSlice.js       # Filter and search state
│       └── roleSlice.js          # User role state
├── index.css             # Global styles and CSS custom properties
├── main.jsx             # App entry point
└── App.css              # Component-specific styles
```

## 🎨 Customization

### Color Theme
The dashboard uses four CSS custom properties for easy customization:
- `--primary`: Main brand color (#3B82F6)
- `--secondary`: Success/accent color (#10B981)
- `--tertiary`: Neutral text color (#6B7280)
- `--fourth`: Warning/error color (#EF4444)

Update these in `src/index.css` to change the entire theme.

### Dark Mode
Dark mode is automatically persisted in localStorage and applies to all components.

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Desktop**: Full sidebar navigation with multi-column layouts
- **Tablet**: Collapsed sidebar with adjusted grid layouts
- **Mobile**: Stacked layout with accessible navigation

## 🔒 Role-Based Access

- **Viewer Role**: Read-only access to all dashboard features
- **Admin Role**: Full access including transaction CRUD operations

## 📊 Data Visualization

- **Line Chart**: Monthly balance trends with smooth curves
- **Pie Chart**: Spending breakdown by category with interactive tooltips
- **Metric Cards**: Key financial indicators with trend indicators

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Quality
- ESLint configuration for code consistency
- Tailwind CSS for maintainable styling
- Component-based architecture for reusability

## 🤝 Contributing

This is an assignment submission project. For improvements or modifications, please fork the repository and create a pull request.

## 📄 License

This project is for educational purposes as part of a frontend development assignment.
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
