import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/Login';
import SignupStudent from '../auth/SignupStudent';
import SignupInstructor from '../auth/SignupInstructor';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import VerifyOtp from '../auth/VerifyOtp';
import AdminDashboard from '../dashboards/AdminDashboard';
import StudentDashboard from '../dashboards/StudentDashboard';
import InstructorDashboard from '../dashboards/InstructorDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup-student" element={<SignupStudent />} />
        <Route path="/signup-instructor" element={<SignupInstructor />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
