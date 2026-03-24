import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Login Successful! Redirecting...')
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    }

    setLoading(false)
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2 className="admin-login-title">Admin Portal</h2>
          <p className="admin-login-subtitle">Sign in to manage the system</p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="admin-input"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="admin-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}
          {success && <div className="admin-login-success">{success}</div>}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Secure Login'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default AdminLogin