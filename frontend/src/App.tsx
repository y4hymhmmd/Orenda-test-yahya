import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Routes>
      {/* Redirect ke "/todolist" jika sudah login, atau ke "/login" kalau belum */}
      <Route path="/" element={<Navigate to="/todolist" />} />
      
      {/* Halaman login dan register tidak butuh proteksi */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Halaman TodoList diproteksi oleh PrivateRoute */}
      <Route 
        path="/todolist" 
        element={
          <PrivateRoute>
            <TodoList />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default App;
