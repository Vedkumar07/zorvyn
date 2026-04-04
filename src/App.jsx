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
    <div className="">
      <div className="flex h-screen bg-gray-50 text-slate-900">
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">Z</div>
              <div>
                <p className="text-base font-semibold">Zorvyn</p>
                <p className="text-xs text-slate-500">Finance Dashboard</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            {/* <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-sm text-slate-500">
              <span>🔍</span>
              <span className="flex-1">Search...</span>
              <span className="text-xs text-slate-400">⌘K</span>
            </div> */}
          </div>

          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-slate-200 space-y-3">
            <div className="bg-slate-50 rounded-2xl p-1 grid grid-cols-2 gap-1">
              {['viewer', 'admin'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => dispatch(setRole(roleKey))}
                  className={`py-2 text-xs font-semibold rounded-2xl transition ${
                    role === roleKey
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-50">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center">{role === 'admin' ? 'A' : 'V'}</div>
              <div className="text-xs leading-4">
                <p className="font-semibold capitalize text-slate-900">{role}</p>
                <p className="text-slate-500">{role === 'admin' ? 'Full access' : 'Read only'}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
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
