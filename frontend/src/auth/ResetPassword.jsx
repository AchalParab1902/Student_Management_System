import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
        navigate('/forgot-password');
    }
  }, [email, navigate]);

  if (!email) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    setLoading(true);
    toast.loading("Resetting password...");
    try {
      await api.post('/auth/reset-password', { email, newPassword, confirmPassword });
      toast.success("Password updated successfully. Please login again.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-0">
      <div className="glass-card w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="text-slate-500 mt-2">Create a new strong password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
             <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
