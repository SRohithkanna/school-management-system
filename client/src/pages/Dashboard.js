import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MdPeople, MdSchool, MdTrendingUp, MdAccessTime } from 'react-icons/md';
import './Dashboard.css';

const COLORS = ['#2563EB', '#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (!stats)  return <div className="loading-state">Failed to load stats.</div>;

  const cards = [
    { label: 'Total Students', value: stats.total, icon: <MdPeople />, color: '#2563EB' },
    { label: 'Total Classes',  value: stats.byClass.length, icon: <MdSchool />, color: '#10B981' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: <MdTrendingUp />, color: '#F59E0B' },
    { label: 'Recently Added', value: stats.recentStudents.length, icon: <MdAccessTime />, color: '#8B5CF6' },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of your school's student data</p>

      <div className="stats-grid">
        {cards.map((c, i) => (
          <div className="stat-card card" key={i}>
            <div className="stat-icon" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
            <div>
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Students by Class</h3>
          {stats.byClass.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.byClass.map(b => ({ name: `Cl.${b._id}`, count: b.count }))}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data yet.</p>}
        </div>

        <div className="card chart-card">
          <h3>Gender Distribution</h3>
          {stats.byGender.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.byGender.map(g => ({ name: g._id, value: g.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {stats.byGender.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data yet.</p>}
        </div>
      </div>

      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3>Recently Added Students</h3>
          <Link to="/students" className="btn btn-secondary" style={{ padding:'7px 14px', fontSize:'0.85rem' }}>View All</Link>
        </div>
        {stats.recentStudents.length === 0 ? (
          <p className="no-data">No students added yet. <Link to="/add-student">Add one →</Link></p>
        ) : (
          <div className="recent-list">
            {stats.recentStudents.map(s => (
              <Link to={`/students/${s._id}`} key={s._id} className="recent-row">
                <div className="mini-avatar">{s.name.charAt(0)}</div>
                <div>
                  <p className="recent-name">{s.name}</p>
                  <p className="recent-meta">Class {s.class}-{s.section} · {s.rollNumber}</p>
                </div>
                <span className="badge badge-blue" style={{ marginLeft:'auto' }}>{s.attendance}% att.</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}