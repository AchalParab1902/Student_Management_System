import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

const SignupInstructor = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', instructorId: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    toast.loading("Creating account...");
    try {
      const response = await axiosInstance.post('/auth/instructor/signup', formData);
      toast.success(response.data.message || "Instructor registered successfully");
      
      // Clear form
      setFormData({
        name: '', email: '', mobile: '', instructorId: '', password: '', confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
      <div className="glass-card w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Instructor Signup</h2>
          <p className="text-slate-500 mt-2">Start sharing your expertise today</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Full Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="input-field" placeholder="Prof. Jane Smith" required />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="jane@institute.com" required />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Mobile Number</label>
            <input name="mobile" type="text" value={formData.mobile} onChange={handleChange} className="input-field" placeholder="9876543210" required />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Instructor ID</label>
            <input name="instructorId" type="text" value={formData.instructorId} onChange={handleChange} className="input-field" placeholder="INS-2024" required />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"}
                value={formData.password} 
                onChange={handleChange} 
                className="input-field pr-10" 
                placeholder="••••••••" 
                required 
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
            <label className="block text-slate-700 text-sm font-semibold mb-1.5 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword} 
                onChange={handleChange} 
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
          
          <div className="sm:col-span-2 pt-4">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait...' : 'Create Instructor Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupInstructor;
