import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from './store/slices/roleSlice';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
  { id: 'transactions', label: 'Transactions', icon: '💳' },
  { id: 'insights', label: 'Insights', icon: '📈' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const role = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();

  return (
    <div className="dark min-h-screen bg-slate-900">
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100">
        <aside className="w-full md:w-60 bg-slate-800 border-slate-700 md:border-r flex flex-col flex-shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto">
          <div className="px-6 py-5 border-b border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">Z</div>
              <div>
                <p className="text-base font-semibold text-white">Zorvyn</p>
                <p className="text-xs text-slate-400">Finance Dashboard</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4"></div>

          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-slate-700 space-y-3">
            <div className="bg-slate-700 rounded-2xl p-1 grid grid-cols-2 gap-1">
              {['viewer', 'admin'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => dispatch(setRole(roleKey))}
                  className={`py-2 text-xs font-semibold rounded-2xl transition ${
                    role === roleKey
                      ? 'bg-slate-600 text-cyan-400 shadow-lg shadow-cyan-500/20 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-700/50 border border-slate-600">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-500/20">{role === 'admin' ? 'A' : 'V'}</div>
              <div className="text-xs leading-4">
                <p className="font-semibold capitalize text-slate-100">{role}</p>
                <p className="text-slate-400">{role === 'admin' ? 'Full access' : 'Read only'}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'transactions' && <Transactions />}
            {activeTab === 'insights' && <Insights />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
