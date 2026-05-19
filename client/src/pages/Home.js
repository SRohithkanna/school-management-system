import React from 'react';
import { Link } from 'react-router-dom';
import { MdPeople, MdPersonAdd, MdDashboard, MdStar } from 'react-icons/md';
import './Home.css';

const features = [
  { icon: <MdPersonAdd />, title: 'Add Students',   desc: 'Quickly register new students with all their details.' },
  { icon: <MdPeople />,    title: 'Manage Students', desc: 'View, edit, search and filter your entire student base.' },
  { icon: <MdDashboard />, title: 'Analytics',       desc: 'Track class-wise, gender-wise and attendance statistics.' },
  { icon: <MdStar />,      title: 'Student Details', desc: 'Deep-dive into individual student profiles and records.' },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-badge">🎓 School Management System</div>
        <h1 className="hero-title">Manage Your School<br /><span>Smarter & Faster</span></h1>
        <p className="hero-desc">
          A complete MERN-powered platform to manage students, track attendance,
          and view analytics — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/add-student" className="btn btn-primary">+ Add Student</Link>
          <Link to="/students" className="btn btn-secondary">View All Students</Link>
        </div>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}