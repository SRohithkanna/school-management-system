import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../services/api';
import { MdSearch, MdEdit, MdDelete, MdVisibility, MdPersonAdd } from 'react-icons/md';
import './StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [cls,      setCls]      = useState('');
  const [gender,   setGender]   = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getStudents({ search, class: cls, gender });
      setStudents(r.data);
    } catch {
      setStudents([]);
    } finally { setLoading(false); }
  }, [search, cls, gender]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    await deleteStudent(id);
    fetchStudents();
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/add-student" className="btn btn-primary"><MdPersonAdd /> Add Student</Link>
      </div>

      <div className="filters card" style={{ marginBottom:20 }}>
        <div className="search-wrap">
          <MdSearch className="search-icon" />
          <input className="search-input" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={cls} onChange={e => setCls(e.target.value)} style={{ width:'auto' }}>
          <option value="">All Classes</option>
          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={gender} onChange={e => setGender(e.target.value)} style={{ width:'auto' }}>
          <option value="">All Genders</option>
          {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="empty-state card">
          <p>No students found. <Link to="/add-student">Add the first one →</Link></p>
        </div>
      ) : (
        <div className="table-wrapper card">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Attendance</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td><span className="student-name">{s.name}</span></td>
                  <td><span className="mono">{s.rollNumber}</span></td>
                  <td><span className="badge badge-blue">Class {s.class}-{s.section}</span></td>
                  <td>{s.gender}</td>
                  <td>
                    <div className="attendance-bar">
                      <div className="bar-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }} />
                      <span>{s.attendance}%</span>
                    </div>
                  </td>
                  <td>{s.grade || '—'}</td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/students/${s._id}`}   className="icon-btn view"><MdVisibility /></Link>
                      <Link to={`/students/${s._id}/edit`} className="icon-btn edit"><MdEdit /></Link>
                      <button onClick={() => handleDelete(s._id, s.name)} className="icon-btn delete"><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}