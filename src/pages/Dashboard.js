import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);

  const PRIORITY_COLOR = { Rendah: '#22c55e', Sedang: '#f59e0b', Tinggi: '#f97316', Kritis: '#ef4444' };
  const STATUS_COLOR = { Baru: '#6366f1', Diproses: '#0ea5e9', Menunggu: '#f59e0b', Selesai: '#22c55e', Ditutup: '#64748b' };

  useEffect(() => {
    if (user?.role === 'admin') {
      API.get('/users/stats').then(r => setStats(r.data)).catch(() => {});
    }
    API.get('/tickets').then(r => setRecentTickets(r.data.slice(0, 5))).catch(() => {});
  }, [user]);

  const Badge = ({ label, color }) => (
    <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{label}</span>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Selamat datang, {user?.nama}! 👋</p>

      {/* Stats (Admin only) */}
      {user?.role === 'admin' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Tiket', value: stats.total, color: '#6366f1', icon: '🎫' },
            { label: 'Tiket Baru', value: stats.baru, color: '#6366f1', icon: '🆕' },
            { label: 'Diproses', value: stats.diproses, color: '#0ea5e9', icon: '⚙️' },
            { label: 'Selesai', value: stats.selesai, color: '#22c55e', icon: '✅' },
            { label: 'Kritis', value: stats.kritis, color: '#ef4444', icon: '🚨' },
            { label: 'Total User', value: stats.totalUser, color: '#f59e0b', icon: '👥' },
          ].map(s => (
            <div key={s.label} style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Tickets */}
      <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2d3a', fontWeight: 700 }}>
          {user?.role === 'admin' ? 'Tiket Terbaru' : 'Tiket Saya'}
        </div>
        {recentTickets.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Belum ada tiket</div>
        )}
        {recentTickets.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid #2a2d3a' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.judul}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{t.kode} • {t.nama_user}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge label={t.prioritas} color={PRIORITY_COLOR[t.prioritas]} />
              <Badge label={t.status} color={STATUS_COLOR[t.status]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
