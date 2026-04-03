import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from './store/slices/roleSlice';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const role = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'insights', label: 'Insights', icon: '📈' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0 shadow-sm">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                Z
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Zorvyn</span>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
              <span className="text-gray-400 text-sm">🔍</span>
              <span className="text-sm text-gray-400">Search...</span>
              <span className="ml-auto text-xs text-gray-300 dark:text-gray-600">⌘K</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom Controls */}
          <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {/* Role Switcher */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
              {['viewer', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => dispatch(setRole(r))}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                    role === r
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                {role === 'admin' ? 'A' : 'V'}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{role}</p>
                <p className="text-xs text-gray-400">{role === 'admin' ? 'Full Access' : 'Read Only'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'insights' && <Insights />}
        </main>
      </div>
    </div>
  );
};

export default App;
