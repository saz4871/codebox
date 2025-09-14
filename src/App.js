import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ProductBacklog from './components/ProductBacklog';
import SprintBacklog from './components/SprintBacklog';
import Project from './components/Project';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/product-backlog" element={<ProductBacklog />} />
      <Route path="/sprint-backlog" element={<SprintBacklog />} />
      <Route path="/project-backlog" element={<Project />} />
    </Routes>
  );
}

export default App;
