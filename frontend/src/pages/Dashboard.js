import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { GraduationCap, Users, PlusCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ teachers: 0, users: 0 });
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, usersRes] = await Promise.all([
          api.get('/teachers'),
          api.get('/teachers/users'),
        ]);
        setStats({
          teachers: teachersRes.data.count,
          users: usersRes.data.count,
        });
        setRecentTeachers(teachersRes.data.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Teachers', value: stats.teachers, icon: <GraduationCap size={28} />, color: 'card-blue', to: '/teachers' },
    { label: 'Registered Users', value: stats.users, icon: <Users size={28} />, color: 'card-green', to: '/users' },
    { label: 'Add Teacher', value: '+', icon: <PlusCircle size={28} />, color: 'card-orange', to: '/add-teacher' },
    { label: 'Growth', value: '↑', icon: <TrendingUp size={28} />, color: 'card-purple', to: '/teachers' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Welcome back, {user?.first_name} 👋</h1>
            <p className="page-sub">Here's what's happening in your portal today.</p>
          </div>
        </div>

        <div className="stats-grid">
          {statCards.map((card) => (
            <Link to={card.to} key={card.label} className={`stat-card ${card.color}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '—' : card.value}</span>
                <span className="stat-label">{card.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="dashboard-bottom">
          <div className="recent-card">
            <div className="card-header">
              <h3>Recent Teachers</h3>
              <Link to="/teachers" className="view-all">View All →</Link>
            </div>
            {loading ? (
              <div className="loading-rows">
                {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
              </div>
            ) : recentTeachers.length === 0 ? (
              <div className="empty-state">
                <GraduationCap size={40} />
                <p>No teachers added yet.</p>
                <Link to="/add-teacher" className="btn-primary">Add First Teacher</Link>
              </div>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>University</th>
                    <th>Designation</th>
                    <th>Year Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTeachers.map((t) => (
                    <tr key={t._id}>
                      <td>{t.user_id?.first_name} {t.user_id?.last_name}</td>
                      <td>{t.university_name}</td>
                      <td><span className="badge">{t.designation}</span></td>
                      <td>{t.year_joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
