import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter hover:opacity-80 transition-opacity">
        AUTH<span className="text-slate-900">SYSTEM</span>
      </Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                {user.role}: {user.name}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-slate-600 font-semibold text-sm hover:text-red-500 transition-colors"
            >
              <LogOut size={18} /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary text-sm py-2">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
