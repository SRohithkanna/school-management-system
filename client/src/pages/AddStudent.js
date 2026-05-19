import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent } from '../services/api';
import './AddStudent.css';

const CLASSES   = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const SECTIONS  = ['A','B','C','D','E'];
const GENDERS   = ['Male','Female','Other'];
const SUBJECTS  = ['Mathematics','Science','English','Hindi','Social Studies','Computer','Physics','Chemistry','Biology','History'];

const initial = { name:'', rollNumber:'', class:'', section:'', age:'', gender:'', email:'', phone:'', address:'', subjects:[], attendance:'', grade:'' };

export default function AddStudent() {
  const [form, setForm]     = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState('');
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      getStudent(id).then(r => {
        const s = r.data;
        setForm({ name:s.name, rollNumber:s.rollNumber, class:s.class, section:s.section, age:s.age, gender:s.gender, email:s.email||'', phone:s.phone||'', address:s.address||'', subjects:s.subjects||[], attendance:s.attendance||'', grade:s.grade||'' });
      });
    }
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name = 'Name is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    if (!form.class)             e.class = 'Class is required';
    if (!form.section)           e.section = 'Section is required';
    if (!form.age || form.age < 3 || form.age > 25) e.age = 'Valid age (3–25) is required';
    if (!form.gender)            e.gender = 'Gender is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleSubject = sub => {
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(sub) ? p.subjects.filter(s => s !== sub) : [...p.subjects, sub]
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) await updateStudent(id, form);
      else        await createStudent(form);
      setMsg(isEdit ? 'Student updated!' : 'Student added!');
      setTimeout(() => navigate('/students'), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="add-student-page">
      <h1 className="page-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
      <p className="page-subtitle">{isEdit ? 'Update student information' : 'Fill in the details to register a student'}</p>

      {msg && <div className={`alert ${msg.includes('!') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <form onSubmit={submit} className="student-form card" noValidate>
        <div className="form-section">
          <h3 className="form-section-title">Basic Info</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. Arjun Sharma" />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label>Roll Number *</label>
              <input name="rollNumber" value={form.rollNumber} onChange={handle} placeholder="e.g. 2024001" />
              {errors.rollNumber && <p className="error-msg">{errors.rollNumber}</p>}
            </div>
          </div>
          <div className="form-row three">
            <div className="form-group">
              <label>Class *</label>
              <select name="class" value={form.class} onChange={handle}>
                <option value="">Select Class</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              {errors.class && <p className="error-msg">{errors.class}</p>}
            </div>
            <div className="form-group">
              <label>Section *</label>
              <select name="section" value={form.section} onChange={handle}>
                <option value="">Select Section</option>
                {SECTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              {errors.section && <p className="error-msg">{errors.section}</p>}
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handle}>
                <option value="">Select Gender</option>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
              {errors.gender && <p className="error-msg">{errors.gender}</p>}
            </div>
          </div>
          <div className="form-row three">
            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="age" value={form.age} onChange={handle} placeholder="e.g. 14" />
              {errors.age && <p className="error-msg">{errors.age}</p>}
            </div>
            <div className="form-group">
              <label>Attendance (%)</label>
              <input type="number" name="attendance" value={form.attendance} onChange={handle} min="0" max="100" placeholder="e.g. 85" />
            </div>
            <div className="form-group">
              <label>Grade</label>
              <input name="grade" value={form.grade} onChange={handle} placeholder="e.g. A+" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Contact Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handle} placeholder="student@school.com" />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="+91 9876543210" />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handle} rows={2} placeholder="Full address" />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Subjects</h3>
          <div className="subjects-grid">
            {SUBJECTS.map(sub => (
              <label key={sub} className={`subject-chip ${form.subjects.includes(sub) ? 'selected' : ''}`}>
                <input type="checkbox" checked={form.subjects.includes(sub)} onChange={() => toggleSubject(sub)} hidden />
                {sub}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
}