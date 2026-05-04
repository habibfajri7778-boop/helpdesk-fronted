import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const STATUSES = ['Semua', 'Baru', 'Diproses', 'Menunggu', 'Selesai', 'Ditutup'];
const PRIORITIES = ['Semua', 'Rendah', 'Sedang', 'Tinggi', 'Kritis'];
const PRIORITY_COLOR = { Rendah: '#22c55e', Sedang: '#f59e0b', Tinggi: '#f97316', Kritis: '#ef4444' };
const STATUS_COLOR = { Baru: '#6366f1', Diproses: '#0ea5e9', Menunggu: '#f59e0b', Selesai: '#22c55e', Ditutup: '#64748b' };

const Badge = ({ label, color }) => (
  <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{label}</span>
);

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterPriority, setFilterPriority] = useState('Semua');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/tickets').then(r => { setTickets(r.data); setFiltered(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    let data = tickets;
    if (filterStatus !== 'Semua') data = data.filter(t => t.status === filterStatus);
    if (filterPriority !== 'Semua') data = data.filter(t => t.prioritas === filterPriority);
    if (search) data = data.filter(t => t.judul.toLowerCase().includes(search.toLowerCase()) || t.kode.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
  }, [search, filterStatus, filterPriority, tickets]);

  const s = {
    input: { padding: '9px 14px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#1a1d27', color: '#e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
    select: { padding: '9px 12px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#1a1d27', color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Semua Tiket</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>{filtered.length} tiket ditemukan</p>
        </div>
        <button onClick={() => navigate('/new-ticket')}
          style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Buat Tiket
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari tiket..." style={{ ...s.input, flex: '1 1 200px' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={s.select}>
          {STATUSES.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={s.select}>
          {PRIORITIES.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px 110px', padding: '10px 20px', borderBottom: '1px solid #2a2d3a', color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <span>ID</span><span>Judul</span><span>Kategori</span><span>Prioritas</span><span>Status</span>
        </div>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Tidak ada tiket ditemukan</div>}
        {filtered.map(t => (
          <div key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}
            style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px 110px', padding: '14px 20px', borderBottom: '1px solid #2a2d3a', alignItems: 'center', cursor: 'pointer', gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2235'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6366f1', fontWeight: 600 }}>{t.kode}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.judul}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>{t.nama_user}</div>
            </div>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{t.kategori}</span>
            <Badge label={t.prioritas} color={PRIORITY_COLOR[t.prioritas]} />
            <Badge label={t.status} color={STATUS_COLOR[t.status]} />
          </div>
        ))}
      </div>
    </div>
  );
}
