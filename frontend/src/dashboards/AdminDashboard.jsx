import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Trash2, UserCheck, UserX, Users, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/users');
      setUsers(data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    try {
      await axiosInstance.patch(`/admin/user/${user._id}/toggle-status`);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = (id) => {
    toast.confirm(
      'Are you sure you want to delete this user permanently?',
      async () => {
        try {
          await axiosInstance.delete(`/admin/user/${id}`);
          toast.success('User deleted successfully');
          fetchUsers();
        } catch (err) {
          toast.error('Failed to delete user');
        }
      },
      () => {
        // Optional: toast.info('Deletion cancelled');
      }
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading management console...</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage system users and access controls</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
              <p className="text-xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Access Role</th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                <th className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                      user.role === 'Student' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                      user.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                   <div className="flex justify-center gap-2">

                      <button 
                        onClick={() => toggleStatus(user)} 
                        className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                          user.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={user.isActive ? 'Revoke Access' : 'Restore Access'}
                      >
                        {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteUser(user._id)} 
                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-sm"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center">
                      <ShieldAlert size={48} className="text-slate-200 mb-4" />
                      <p className="text-slate-400 font-medium italic">No users available in the system</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
