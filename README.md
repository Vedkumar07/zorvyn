# Finance Dashboard

A modern, responsive finance dashboard built with React, Redux Toolkit, and Tailwind CSS. This project showcases advanced frontend development skills including state management, data visualization, role-based access control, and professional UI design.

## 🌐 Live Demo

**Deploy Link**: [https://zorvyn-six-xi.vercel.app/](https://zorvyn-six-xi.vercel.app/)

Experience the Finance Dashboard with a professional dark theme inspired by fintech design principles. All features are fully functional including CRUD operations, advanced filtering, data export, and comprehensive analytics.

## ✨ Features

### Dashboard Overview
- **Summary Cards**: Total balance, monthly income, and expenses with trend indicators
- **Interactive Charts**: Balance trend line chart and spending breakdown pie chart
- **Real-time Updates**: All metrics update dynamically based on transaction data

### Transactions Management
- **Comprehensive Table**: Sortable and filterable transaction list
- **Advanced Filtering**: Filter by category, type (income/expense), date range, and amount range
- **Data Export**: Export filtered transactions to CSV or JSON formats
- **CRUD Operations**: Add, edit, and delete transactions (Admin role only)
- **Modal Forms**: Clean, accessible forms for transaction management

### Insights & Analytics
- **Key Metrics**: Total balance, income, expenses, and active categories
- **Highest Spending Category**: Identifies your biggest expense category
- **Monthly Comparison**: Compare income and expenses between current and previous month
- **Performance Overview**: Visual line chart of recent transaction trends

### User Experience
- **Role-Based Access**: Switch between Viewer (read-only) and Admin (full access) roles
- **Professional Dark Theme**: Inspired by fintech design with cyan accents and deep navy backgrounds
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth transitions, hover effects, and intuitive interactions

### Technical Features
- **Professional Dark Theme**: Fintech-inspired with cyan accents and customizable CSS variables
- **Advanced State Management**: Redux Toolkit with specialized slices for clean architecture
- **Data Persistence**: Theme and role preferences stored in localStorage
- **Export Functionality**: Download transaction data in CSV or JSON formats
- **Advanced Filtering**: Multi-criteria filters with date range and amount range
- **Responsive Charts**: Interactive Recharts with dark-themed styling
- **Mock Data**: 20 pre-loaded sample transactions for demonstration
- **Type-Safe Components**: Well-structured with consistent prop handling

## 🛠 Tech Stack

- **Frontend Framework**: React 19 with Hooks
- **State Management**: Redux Toolkit with slices for transactions, filters, role, and theme
- **Styling**: Tailwind CSS 4.2 with dark theme and custom color variables
- **Charts & Visualization**: Recharts 3.8 for interactive charts
- **Date Handling**: date-fns 4.1 for formatting and calculations
- **Data Export**: PapaParse for CSV generation and JSON serialization
- **Build Tool**: Vite 8.0 for fast development and optimized production builds
- **Icons**: Unicode emojis and SVG icons for lightweight, accessible iconography

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
│   ├── Transactions.jsx  # Transaction management with table, forms, and export
│   └── Insights.jsx      # Financial insights and analytics
├── store/
│   ├── index.js          # Redux store configuration
│   └── slices/
│       ├── transactionsSlice.js  # Transaction CRUD state management
│       ├── filtersSlice.js       # Filter, search, and sorting state
│       ├── roleSlice.js          # User role (Viewer/Admin) state
│       └── themeSlice.js         # Theme persistence state
├── index.css             # Global styles and dark theme CSS variables
├── main.jsx              # App entry point
└── vite.config.js        # Vite configuration
```

## 🎨 Customization

### Color Theme
The dashboard uses a professional dark theme with fintech-inspired styling:
- **Primary Background**: Deep Navy (`#0a0e27`)
- **Surface**: Slate (`#111d3d`, `#1a2847`)
- **Accent**: Cyan (`#60A5FA`, `#0ea5e9`) for interactive elements
- **Text**: Light Slate (`#f1f5f9`) for high contrast readability
- **Status Colors**: Green for income, Red for expenses

Update CSS variables in `src/index.css` to customize the theme colors.

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

## 🎯 Approach and Assumptions

- **State Management**: Redux Toolkit with specialized slices (transactions, filters, role, theme) for clean separation of concerns and predictable state updates.
- **Dark Theme**: Professional fintech-inspired design with deep navy backgrounds and cyan accents for modern visual appeal and reduced eye strain.
- **Mock Data**: Initialized with 20 sample transactions for demonstration. All CRUD operations update state in real-time.
- **Role Simulation**: Frontend-only role switching without backend authentication; useful for demonstrating UI adaptation.
- **Data Export**: Supports both CSV (tabular) and JSON (structured) formats for user convenience and data portability.
- **Advanced Filtering**: Multi-criteria filtering with date range, amount range, category, and type selection for comprehensive data analysis.
- **Responsive Architecture**: Mobile-first design approach with adaptive layouts for all screen sizes.
- **Performance**: Optimized rendering with Redux subscriptions; no additional optimizations needed at this scale.

## Features in Detail

- **Dashboard**: Real-time calculations of total balance, income, and expenses. Interactive charts display balance trends and spending breakdown by category with color-coded visualization.
  
- **Transactions**: Full CRUD functionality with an admin-only feature set. Advanced filtering supports multiple criteria (category, type, date range, amount range). Export data to CSV or JSON formats for external analysis.
  
- **Insights**: Computed metrics from transaction data including highest spending category identification, monthly comparison analysis, and performance trends displayed through interactive charts.

- **Role-Based Access**: Seamless switching between Viewer (read-only) and Admin (full access) roles with UI elements that adapt based on selected role.

This project demonstrates clean code architecture, component modularity, state management best practices, and professional UI/UX design while maintaining full functionality and responsiveness.
