import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdPersonAdd, MdSchool } from 'react-icons/md';
import './Sidebar.css';

const links = [
  { to: '/',           icon: <MdSchool />,    label: 'Home' },
  { to: '/dashboard',  icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/students',   icon: <MdPeople />,    label: 'Students' },
  { to: '/add-student',icon: <MdPersonAdd />, label: 'Add Student' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <MdSchool className="logo-icon" />
        <span>EduManage</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            {l.icon}
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>School Management System</span>
      </div>
    </aside>
  );
}