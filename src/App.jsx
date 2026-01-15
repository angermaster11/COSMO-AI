import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './Components/Home';
import Login from './Components/Login'; // Make sure Login.jsx exists
import Dashboard from './Components/Dashboard'; // Make sure Dashboard.jsx exists
import ProtectedRoute from './Utils/ProtectedRoute'; // Make sure ProtectedRoute.jsx exists
import StudentDashboard from './Components/StudentDashboard';
import StaffDashboard from './Components/StaffDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
