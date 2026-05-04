import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nama: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', { email: form.email, password: form.password });
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      } else {
        await API.post('/auth/register', form);
        setError('');
        alert('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
    setLoading(false);
  };

  const s = styles;

  return (
    <div style={s.bg}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <span style={s.logoIcon}>H</span>
          <span style={s.logoText}>HelpDesk</span>
        </div>
        <h2 style={s.title}>{isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</h2>
        <p style={s.sub}>{isLogin ? 'Selamat datang kembali!' : 'Buat akun untuk mulai membuat tiket'}</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.form}>
          {!isLogin && (
            <div style={s.field}>
              <label style={s.label}>Nama Lengkap</label>
              <input style={s.input} placeholder="Nama lengkap kamu" value={form.nama}
                onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
            </div>
          )}
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="email@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </div>

        <p style={s.toggle}>
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <span style={s.link} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Daftar sekarang' : 'Masuk'}
          </span>
        </p>

        {isLogin && (
          <div style={s.hint}>
            <b>Akun Demo:</b><br />
            Admin: admin@helpdesk.com / password<br />
            User: budi@example.com / password
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: { minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 18, padding: '40px 36px', width: '100%', maxWidth: 420 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, justifyContent: 'center' },
  logoIcon: { width: 40, height: 40, borderRadius: 12, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, lineHeight: '40px', textAlign: 'center' },
  logoText: { fontSize: 22, fontWeight: 800, color: '#e2e8f0' },
  title: { textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#e2e8f0', marginBottom: 6 },
  sub: { textAlign: 'center', fontSize: 14, color: '#64748b', marginBottom: 24 },
  error: { background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#94a3b8' },
  input: { padding: '11px 14px', borderRadius: 9, border: '1px solid #2a2d3a', background: '#0f1117', color: '#e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  btn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 },
  toggle: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' },
  link: { color: '#6366f1', fontWeight: 700, cursor: 'pointer' },
  hint: { marginTop: 16, background: '#6366f111', border: '1px solid #6366f133', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#94a3b8', lineHeight: 1.8 },
};
