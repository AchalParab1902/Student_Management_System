import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Sending OTP...");
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success("OTP sent successfully. Please check your email.");
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-0">
      <div className="glass-card w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h2>
          <p className="text-slate-500 mt-2">Enter your email to receive a reset OTP</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@company.com"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-indigo-600 font-medium text-sm hover:text-indigo-500">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
