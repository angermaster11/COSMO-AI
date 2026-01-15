// src/Components/DashboardRouter.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
      navigate('/login');
    } else if (userData.role === 'student') {
      navigate('/student-dashboard');
    } else if (userData.role === 'staff') {
      navigate('/staff-dashboard');
    } else {
      navigate('/login'); // default fallback
    }
  }, [navigate]);

  return <div className="text-white text-center py-20">Redirecting...</div>;
};

export default Dashboard;
