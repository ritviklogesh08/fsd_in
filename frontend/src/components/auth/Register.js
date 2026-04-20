import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" onChange={handleChange} value={form.name} required />
        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} value={form.email} required />
        <label>Password</label>
        <input type="password" name="password" onChange={handleChange} value={form.password} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
