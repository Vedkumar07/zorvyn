import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../store/slices/roleSlice';

const RoleSwitcher = () => {
  const currentRole = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();

  const handleRoleChange = (e) => {
    dispatch(setRole(e.target.value));
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="role-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Role:
      </label>
      <select
        id="role-select"
        value={currentRole}
        onChange={handleRoleChange}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};

export default RoleSwitcher;