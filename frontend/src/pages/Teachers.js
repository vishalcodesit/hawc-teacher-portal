import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Trash2, Search, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch teachers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const result = teachers.filter((t) =>
      t.user_id?.first_name?.toLowerCase().includes(q) ||
      t.user_id?.last_name?.toLowerCase().includes(q) ||
      t.user_id?.email?.toLowerCase().includes(q) ||
      t.university_name?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q)
    );
    setFiltered(result);
    setPage(1);
  }, [search, teachers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher and their user account?')) return;
    try {
      await api.delete(`/teachers/${id}`);
      toast.success('Teacher deleted.');
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const genderBadgeClass = (g) =>
    g === 'Male' ? 'badge badge-blue' : g === 'Female' ? 'badge badge-pink' : 'badge badge-gray';

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Teachers</h1>
            <p className="page-sub">All registered teachers in the system.</p>
          </div>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="loading-rows">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton-row" />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="empty-state">
              <GraduationCap size={48} />
              <p>{search ? 'No results found.' : 'No teachers yet.'}</p>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>University</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Gender</th>
                      <th>Year Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((t, idx) => (
                      <tr key={t._id}>
                        <td className="row-num">{(page - 1) * PER_PAGE + idx + 1}</td>
                        <td className="name-cell">
                          <div className="avatar">{t.user_id?.first_name?.[0]}{t.user_id?.last_name?.[0]}</div>
                          <span>{t.user_id?.first_name} {t.user_id?.last_name}</span>
                        </td>
                        <td>{t.user_id?.email}</td>
                        <td>{t.university_name}</td>
                        <td>{t.department || '—'}</td>
                        <td><span className="badge badge-teal">{t.designation}</span></td>
                        <td><span className={genderBadgeClass(t.gender)}>{t.gender}</span></td>
                        <td>{t.year_joined}</td>
                        <td>
                          <button className="icon-btn danger" onClick={() => handleDelete(t._id)} title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="page-info">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="page-btns">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={16} /></button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={16} /></button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Teachers;
