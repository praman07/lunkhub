import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!identifier || !password) {
            setError('All fields are required')
            return
        }

        setLoading(true)
        try {
            const data = await login({ identifier, password })
            navigate(`/${data.user.username}`)
        } catch (err) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#eff0ec] flex items-center justify-center px-4 py-12 text-[#1e2330] font-sans">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#254f1a]">Welcome Back</p>
                    <h2 className="mt-1 text-4xl font-black tracking-tight text-[#1e2330]">
                        Log In
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#1e2330]/70">
                        Access your profile and track link activity
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border-0">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-2xl bg-[#780016] p-4 text-sm font-bold text-white">
                                {error}
                            </div>
                        )}

                        {/* Username/Email Field */}
                        <div className="space-y-1.5 group">
                            <label htmlFor="identifier" className="text-xs font-black uppercase tracking-wider text-[#1e2330]/70">
                                Username or Email
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-[#1e2330]/40">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="john_doe or john@example.com"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 rounded-full text-sm font-black text-white bg-[#1e2330] hover:bg-[#254f1a] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm font-semibold text-[#1e2330]/70">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-black text-[#254f1a] hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login