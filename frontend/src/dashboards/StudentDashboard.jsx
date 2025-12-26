import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User, Mail, Smartphone, Hash, Layers, GraduationCap } from 'lucide-react';
// import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/student/profile');
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
      <p className="mt-4 text-slate-500 font-medium">Fetching your records...</p>
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
          <GraduationCap className="text-indigo-600" size={40} /> Student Hub
        </h1>
        <p className="text-slate-500 mt-1 font-medium italic">Welcome back to your academic portal</p>
      </div>

      <div className="glass-card">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 text-center md:text-left">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-3xl rotate-3 shadow-xl shadow-indigo-100 flex items-center justify-center text-white text-4xl font-black">
            {profile.user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{profile.user.name}</h2>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mt-1">Student Scholar</p>
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
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
            <Hash className="text-indigo-400 mb-3 group-hover:text-indigo-600 transition-colors" size={20} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Roll No</p>
            <p className="text-xl font-black text-slate-800 mt-1">{profile.rollNo}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
            <Layers className="text-indigo-400 mb-3 group-hover:text-indigo-600 transition-colors" size={20} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrolled Division</p>
            <p className="text-xl font-black text-slate-800 mt-1"> {profile.division}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
