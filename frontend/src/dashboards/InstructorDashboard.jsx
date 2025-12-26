import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Mail, Smartphone, Award, Briefcase } from 'lucide-react';
// import toast from 'react-hot-toast';

const InstructorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/instructor/profile');
        setProfile(data);
      } catch (err) {
        // toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading faculty portal...</p>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
      <p>Error loading profile data</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Briefcase className="text-indigo-600" size={40} /> Faculty Dashboard
        </h1>
        <p className="text-slate-500 mt-1 font-medium italic">Welcome back to your instructional console</p>
      </div>

      <div className="glass-card">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 text-center md:text-left">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full rotate-3 shadow-xl shadow-indigo-100 flex items-center justify-center text-white text-4xl font-black">
            {profile.user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{profile.user.name}</h2>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mt-1">Lead Instructor</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Mail size={16} className="text-indigo-400" /> {profile.user.email}
              </span>
              <span className="flex items-center gap-2 text-slate-500 text-sm font-medium border-l border-slate-200 pl-4 hidden sm:flex">
                <Smartphone size={16} className="text-indigo-400" /> {profile.mobile}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-8 bg-indigo-600 rounded-2xl shadow-indigo-200 shadow-lg text-white group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10"></div>
            <Award className="mb-4 opacity-80" size={32} />
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Instructor Verification ID</p>
            <p className="text-2xl font-black mt-1">{profile.instructorId}</p>
          </div>
          
          <div className="p-8 bg-white border border-slate-100 rounded-2xl flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Status</p>
            </div>
            <p className="text-xl font-bold text-slate-800">Verified Educator</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Access granted to instructional resources</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
