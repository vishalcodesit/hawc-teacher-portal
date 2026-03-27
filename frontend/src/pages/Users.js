import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/teachers/users');
        setUsers(res.data.data);
        setFiltered(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const result = users.filter((u) =>
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
    setFiltered(result);
    setPage(1);
  }, [search, users]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Auth Users</h1>
            <p className="page-sub">All registered user accounts in the system.</p>
          </div>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
              <Users size={48} />
              <p>{search ? 'No results found.' : 'No users yet.'}</p>
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
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((u, idx) => (
                      <tr key={u._id}>
                        <td className="row-num">{(page - 1) * PER_PAGE + idx + 1}</td>
                        <td className="name-cell">
                          <div className="avatar">{u.first_name?.[0]}{u.last_name?.[0]}</div>
                          <span>{u.first_name} {u.last_name}</span>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td>
                          <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
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

export default UsersPage;
