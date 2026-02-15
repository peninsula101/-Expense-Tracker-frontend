import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  HomeIcon, 
  TableCellsIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  if (!user && !token) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Explorer', path: '/explorer', icon: TableCellsIcon },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col p-6 shadow-2xl z-50">
      <div className="mb-10">
        <h1 className="text-2xl font-black tracking-tighter text-blue-500">
          Expense<span className="text-white font-light">Tracker</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-semibold">{item.name}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-200 mt-auto"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        <span className="font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;