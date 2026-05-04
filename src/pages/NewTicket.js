import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CATEGORIES = ['Teknis', 'Billing', 'Akun', 'Umum', 'Bug'];
const PRIORITIES = ['Rendah', 'Sedang', 'Tinggi', 'Kritis'];

export default function NewTicket() {
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'Teknis', prioritas: 'Sedang' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.judul || !form.deskripsi) {
      setError('Judul dan deskripsi wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/tickets', form);
      alert(res.data.message);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat tiket.');
    }
    setLoading(false);
  };

  const s = {
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 },
    input: { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#0f1117', color: '#e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#0f1117', color: '#e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Buat Tiket Baru</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Isi formulir berikut untuk mengajukan masalah</p>

      <div style={{ maxWidth: 640, background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 16, padding: 28 }}>
        {error && <div style={{ background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', padding: '10px 16px', borderRadius: 8, marginBottom: 18, fontWeight: 600, fontSize: 14 }}>⚠ {error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={s.label}>Judul Tiket *</label>
            <input style={s.input} placeholder="Deskripsi singkat masalah Anda" value={form.judul}
              onChange={e => setForm(p => ({ ...p, judul: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={s.label}>Kategori</label>
              <select style={s.select} value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Prioritas</label>
              <select style={s.select} value={form.prioritas} onChange={e => setForm(p => ({ ...p, prioritas: e.target.value }))}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={s.label}>Deskripsi Masalah *</label>
            <textarea style={{ ...s.input, resize: 'vertical' }} rows={6}
              placeholder="Jelaskan masalah Anda secara detail..."
              value={form.deskripsi} onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/tickets')}
              style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #2a2d3a', background: 'transparent', color: '#94a3b8', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Batal
            </button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex: 2, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Mengirim...' : 'Kirim Tiket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
