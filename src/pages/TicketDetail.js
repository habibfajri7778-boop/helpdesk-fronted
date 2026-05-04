import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const STATUSES = ['Baru', 'Diproses', 'Menunggu', 'Selesai', 'Ditutup'];
const PRIORITY_COLOR = { Rendah: '#22c55e', Sedang: '#f59e0b', Tinggi: '#f97316', Kritis: '#ef4444' };
const STATUS_COLOR = { Baru: '#6366f1', Diproses: '#0ea5e9', Menunggu: '#f59e0b', Selesai: '#22c55e', Ditutup: '#64748b' };

const Badge = ({ label, color }) => (
  <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{label}</span>
);

function formatDate(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTicket = () => {
    API.get(`/tickets/${id}`).then(r => setTicket(r.data)).catch(() => navigate('/tickets'));
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await API.post('/comments', { ticket_id: id, isi: comment });
      setComment('');
      fetchTicket();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim komentar.');
    }
    setLoading(false);
  };

  const handleStatus = async (status) => {
    try {
      await API.put(`/tickets/${id}/status`, { status });
      fetchTicket();
    } catch (err) {
      alert('Gagal mengubah status.');
    }
  };

  if (!ticket) return <div style={{ color: '#64748b', padding: 40 }}>Memuat...</div>;

  return (
    <div>
      <button onClick={() => navigate('/tickets')}
        style={{ background: 'transparent', border: '1px solid #2a2d3a', color: '#64748b', borderRadius: 8, padding: '6px 14px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', marginBottom: 20 }}>
        ← Kembali
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Kiri */}
        <div>
          {/* Info tiket */}
          <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{ticket.judul}</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Badge label={ticket.prioritas} color={PRIORITY_COLOR[ticket.prioritas]} />
              <Badge label={ticket.status} color={STATUS_COLOR[ticket.status]} />
              <Badge label={ticket.kategori} color="#64748b" />
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>{ticket.deskripsi}</p>
          </div>

          {/* Komentar */}
          <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Komentar ({ticket.comments?.length || 0})</h3>
            {(!ticket.comments || ticket.comments.length === 0) && (
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Belum ada komentar.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {ticket.comments?.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {c.nama_user?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{c.nama_user}</span>
                      {c.role === 'admin' && <Badge label="Admin" color="#6366f1" />}
                      <span style={{ color: '#64748b', fontSize: 12 }}>{formatDate(c.created_at)}</span>
                    </div>
                    <div style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: 10, padding: '10px 14px', fontSize: 14, lineHeight: 1.6, color: '#e2e8f0' }}>{c.isi}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Tulis balasan..." rows={2}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#0f1117', color: '#e2e8f0', fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none' }} />
              <button onClick={handleComment} disabled={loading}
                style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, padding: '0 18px', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
                Kirim
              </button>
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Info */}
          <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Info Tiket</h3>
            {[
              { label: 'Kode', value: ticket.kode },
              { label: 'Pemohon', value: ticket.nama_user },
              { label: 'Email', value: ticket.email_user },
              { label: 'Dibuat', value: formatDate(ticket.created_at) },
              { label: 'Diperbarui', value: formatDate(ticket.updated_at) },
            ].map(i => (
              <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{i.label}</span>
                <span style={{ fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{i.value}</span>
              </div>
            ))}
          </div>

          {/* Ubah Status (admin only) */}
          {user?.role === 'admin' && (
            <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ubah Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => handleStatus(s)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                      border: `1px solid ${ticket.status === s ? STATUS_COLOR[s] : '#2a2d3a'}`,
                      background: ticket.status === s ? STATUS_COLOR[s] + '22' : 'transparent',
                      color: ticket.status === s ? STATUS_COLOR[s] : '#64748b',
                    }}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
