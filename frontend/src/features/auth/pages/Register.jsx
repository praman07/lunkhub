import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router'

const Register = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('username') || ''
    })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setLoading(true)
        try {
            const data = await register({ username, email, password })
            navigate(`/${data.user.username}`)
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#eff0ec] flex items-center justify-center px-4 py-12 text-[#1e2330] font-sans">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#254f1a]">Join the Circle</p>
                    <h2 className="mt-1 text-4xl font-black tracking-tight text-[#1e2330]">
                        Create Account
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#1e2330]/70">
                        Launch your premium bio space in seconds
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border-0">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-2xl bg-[#780016] p-4 text-sm font-bold text-white">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-1.5 group">
                            <label htmlFor="username" className="text-xs font-black uppercase tracking-wider text-[#1e2330]/70">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-[#1e2330]/40">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                    placeholder="john_doe"
                                    className="w-full rounded-2xl border-0 bg-[#eff0ec] py-4 pl-12 pr-4 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5 group">
                            <label htmlFor="email-address" className="text-xs font-black uppercase tracking-wider text-[#1e2330]/70">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-[#1e2330]/40">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full rounded-2xl border-0 bg-[#eff0ec] py-4 pl-12 pr-4 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5 group">
                            <label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-[#1e2330]/70">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-[#1e2330]/40">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl border-0 bg-[#eff0ec] py-4 pl-12 pr-4 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition-all"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5 group">
                            <label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-wider text-[#1e2330]/70">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-[#1e2330]/40">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl border-0 bg-[#eff0ec] py-4 pl-12 pr-4 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 rounded-full text-sm font-black text-white bg-[#1e2330] hover:bg-[#254f1a] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm font-semibold text-[#1e2330]/70">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-[#254f1a] hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register