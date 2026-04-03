import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../store/slices/roleSlice';

const RoleSwitcher = () => {
  const currentRole = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();

  const handleRoleChange = (e) => {
    dispatch(setRole(e.target.value));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Role</h3>
        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-xl">👤</span>
        </div>
      </div>
      <select
        id="role-select"
        value={currentRole}
        onChange={handleRoleChange}
        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white transition-colors"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
      <p className="text-sm text-tertiary mt-2">
        {currentRole === 'viewer' ? 'View-only access to dashboard' : 'Full access including transaction management'}
      </p>
    </div>
  );
};

export default RoleSwitcher;