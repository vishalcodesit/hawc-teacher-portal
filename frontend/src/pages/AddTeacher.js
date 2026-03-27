import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, Building, BookOpen, Calendar, Briefcase } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const AddTeacher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // auth_user fields
    first_name: '', last_name: '', email: '', password: '', phone: '',
    // teacher fields
    university_name: '', gender: '', year_joined: '',
    department: '', designation: 'Lecturer', subject_specialization: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (form.year_joined < 1900 || form.year_joined > CURRENT_YEAR) {
      toast.error(`Year joined must be between 1900 and ${CURRENT_YEAR}.`);
      return;
    }
    setLoading(true);
    try {
      await api.post('/teachers', { ...form, year_joined: Number(form.year_joined) });
      toast.success('Teacher added successfully!');
      navigate('/teachers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add teacher.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, icon, children }) => (
    <div className="input-group">
      <label>{label}</label>
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        {children}
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Add Teacher</h1>
            <p className="page-sub">Creates a user account and teacher profile in one step.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card">

          {/* Section: User Account */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={18} /> User Account (auth_user)
            </h3>
            <div className="form-grid">
              <Field label="First Name *" icon={<User size={15} />}>
                <input type="text" name="first_name" placeholder="John"
                  value={form.first_name} onChange={handleChange} required />
              </Field>
              <Field label="Last Name *" icon={<User size={15} />}>
                <input type="text" name="last_name" placeholder="Doe"
                  value={form.last_name} onChange={handleChange} required />
              </Field>
              <Field label="Email Address *" icon={<Mail size={15} />}>
                <input type="email" name="email" placeholder="teacher@university.edu"
                  value={form.email} onChange={handleChange} required />
              </Field>
              <Field label="Phone" icon={<Phone size={15} />}>
                <input type="tel" name="phone" placeholder="+91 98765 43210"
                  value={form.phone} onChange={handleChange} />
              </Field>
              <Field label="Password *" icon={<Lock size={15} />}>
                <input type="password" name="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required />
              </Field>
            </div>
          </div>

          {/* Section: Teacher Profile */}
          <div className="form-section">
            <h3 className="section-title">
              <Briefcase size={18} /> Teacher Profile (teachers)
            </h3>
            <div className="form-grid">
              <Field label="University Name *" icon={<Building size={15} />}>
                <input type="text" name="university_name" placeholder="IIT Madras"
                  value={form.university_name} onChange={handleChange} required />
              </Field>
              <Field label="Department" icon={<BookOpen size={15} />}>
                <input type="text" name="department" placeholder="Computer Science"
                  value={form.department} onChange={handleChange} />
              </Field>
              <Field label="Gender *" icon={<User size={15} />}>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Designation" icon={<Briefcase size={15} />}>
                <select name="designation" value={form.designation} onChange={handleChange}>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Year Joined *" icon={<Calendar size={15} />}>
                <input type="number" name="year_joined" placeholder={CURRENT_YEAR}
                  min="1900" max={CURRENT_YEAR}
                  value={form.year_joined} onChange={handleChange} required />
              </Field>
              <Field label="Subject Specialization" icon={<BookOpen size={15} />}>
                <input type="text" name="subject_specialization" placeholder="Machine Learning"
                  value={form.subject_specialization} onChange={handleChange} />
              </Field>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/teachers')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Add Teacher'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTeacher;
