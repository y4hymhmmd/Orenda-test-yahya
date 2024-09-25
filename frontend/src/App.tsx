import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todolist" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
