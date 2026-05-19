import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStudent, deleteStudent } from '../services/api';
import { MdEdit, MdDelete, MdArrowBack, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import './StudentDetail.css';

export default function StudentDetail() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getStudent(id)
      .then(r => setStudent(r.data))
      .catch(() => navigate('/students'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    await deleteStudent(id);
    navigate('/students');
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!student) return null;

  const attColor = student.attendance >= 75 ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="student-detail-page">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/students')}><MdArrowBack /> Back</button>
        <div className="detail-actions">
          <Link to={`/students/${id}/edit`} className="btn btn-secondary"><MdEdit /> Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}><MdDelete /> Delete</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="profile-card card">
          <div className="avatar">{student.name.charAt(0).toUpperCase()}</div>
          <h2>{student.name}</h2>
          <span className="badge badge-blue">Class {student.class}-{student.section}</span>
          <p className="roll-no">#{student.rollNumber}</p>

          <div className="stat-row">
            <div className="stat">
              <span className="stat-val" style={{ color: attColor }}>{student.attendance}%</span>
              <span className="stat-label">Attendance</span>
            </div>
            <div className="stat">
              <span className="stat-val">{student.grade || '—'}</span>
              <span className="stat-label">Grade</span>
            </div>
            <div className="stat">
              <span className="stat-val">{student.age}</span>
              <span className="stat-label">Age</span>
            </div>
          </div>

          <div className="att-bar-wrap">
            <div className="att-bar-track">
              <div className="att-bar-fill" style={{ width: `${student.attendance}%`, background: attColor }} />
            </div>
            <span style={{ color: attColor, fontSize:'0.85rem', fontWeight:600 }}>{student.attendance >= 75 ? 'Good Standing' : 'Below Threshold'}</span>
          </div>
        </div>

        <div className="info-cards">
          <div className="card info-section">
            <h3>Personal Information</h3>
            <div className="info-row"><span>Full Name</span><span>{student.name}</span></div>
            <div className="info-row"><span>Gender</span><span>{student.gender}</span></div>
            <div className="info-row"><span>Age</span><span>{student.age} years</span></div>
            <div className="info-row"><span>Roll Number</span><span className="mono">#{student.rollNumber}</span></div>
            <div className="info-row"><span>Enrolled On</span><span>{new Date(student.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span></div>
          </div>

          <div className="card info-section">
            <h3>Contact Details</h3>
            {student.email && <div className="info-row"><MdEmail /><span>{student.email}</span></div>}
            {student.phone && <div className="info-row"><MdPhone /><span>{student.phone}</span></div>}
            {student.address && <div className="info-row"><MdLocationOn /><span>{student.address}</span></div>}
            {!student.email && !student.phone && !student.address && <p style={{ color:'var(--gray-400)', fontSize:'0.9rem' }}>No contact details added.</p>}
          </div>

          {student.subjects?.length > 0 && (
            <div className="card info-section">
              <h3>Subjects ({student.subjects.length})</h3>
              <div className="subjects-wrap">
                {student.subjects.map(s => <span key={s} className="badge badge-blue" style={{ margin:'3px' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}