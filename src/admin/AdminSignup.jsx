import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './AdminSignup.css'

function AdminSignup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError("Passwords do not match!")
            setLoading(false)
            return
        }

        // Pass data into Supabase Authentication
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess('Account created! User data safely stored in Supabase Auth.')
        }

        setLoading(false)
    }

    return (
        <div className="admin-signup-container">
            <div className="admin-signup-card">
                <div className="admin-signup-header">
                    <h2 className="admin-signup-title">Create Admin</h2>
                    <p className="admin-signup-subtitle">Register a new administrator account</p>
                </div>

                <form className="admin-signup-form" onSubmit={handleSignup}>


                    <div className="admin-signup-input-group">
                        <label className="admin-signup-input-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            className="admin-signup-input"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-signup-input-group">
                        <label className="admin-signup-input-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="admin-signup-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="admin-signup-input-group">
                        <label className="admin-signup-input-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            className="admin-signup-input"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <div className="admin-signup-error">{error}</div>}
                    {success && <div className="admin-signup-success">{success}</div>}

                    <button
                        type="submit"
                        className="admin-signup-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner"></span> : 'Create Account'}
                    </button>
                </form>

                <div className="admin-signup-footer">
                    Already have an account?{' '}
                    <Link to="/admin" className="admin-signup-link">Login here</Link>
                </div>
            </div>
        </div>
    )
}

export default AdminSignup
