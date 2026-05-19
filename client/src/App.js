import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home          from './pages/Home';
import Dashboard     from './pages/Dashboard';
import StudentList   from './pages/StudentList';
import AddStudent    from './pages/AddStudent';
import StudentDetail from './pages/StudentDetail';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/dashboard"           element={<Dashboard />} />
            <Route path="/students"            element={<StudentList />} />
            <Route path="/add-student"         element={<AddStudent />} />
            <Route path="/students/:id"        element={<StudentDetail />} />
            <Route path="/students/:id/edit"   element={<AddStudent />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}