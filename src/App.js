import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';

// Layout utama setelah login
function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { path: '/tickets', icon: '🎫', label: 'Semua Tiket' },
    { path: '/new-ticket', icon: '+', label: 'Buat Tiket' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: '#1a1d27', borderRight: '1px solid #2a2d3a', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #2a2d3a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>H</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>HelpDesk</span>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px',
                borderRadius: 10, marginBottom: 4, border: 'none', textAlign: 'left', cursor: 'pointer',
                background: isActive(item.path) ? '#6366f122' : 'transparent',
                color: isActive(item.path) ? '#6366f1' : '#64748b',
                fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
              }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid #2a2d3a' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, paddingLeft: 4 }}>{user?.nama}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, paddingLeft: 4 }}>{user?.email}</div>
          <button onClick={() => { logout(); navigate('/login'); }}
            style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #2a2d3a', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Keluar
          </button>
        </div>
      </div>

      {/* Konten */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 28 }}>{children}</div>
      </div>
    </div>
  );
}

// Route yang butuh login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#64748b', padding: 40 }}>Memuat...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><Layout><TicketList /></Layout></PrivateRoute>} />
          <Route path="/tickets/:id" element={<PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>} />
          <Route path="/new-ticket" element={<PrivateRoute><Layout><NewTicket /></Layout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
