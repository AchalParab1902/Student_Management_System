import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
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
    setLoading(true);
    toast.loading("Verifying OTP...");
    try {
      await api.post('/auth/verify-otp', { email, otp });
      toast.success("OTP verified successfully.");
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-0">
      <div className="glass-card w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify OTP</h2>
          <p className="text-slate-500 mt-2">Enter the 6-digit code sent to {email}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">OTP Code</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              className="input-field text-center tracking-widest text-2xl"
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/forgot-password" className="text-indigo-600 font-medium text-sm hover:text-indigo-500">
                Resend OTP?
            </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
