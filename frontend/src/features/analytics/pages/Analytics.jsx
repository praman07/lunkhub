import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { getAnalytics } from '../services/analytics.api'
import { useNavigate, Link } from 'react-router'

const Analytics = () => {
    const { user, loading: authLoading, logout } = useAuth()
    const navigate = useNavigate()

    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login')
        }
    }, [user, authLoading, navigate])

    useEffect(() => {
        if (user) {
            setLoading(true)
            getAnalytics({ username: user.username })
                .then((data) => {
                    setAnalytics(data)
                    setError('')
                })
                .catch((err) => {
                    console.error(err)
                    setError(err.response?.data?.message || 'Failed to fetch analytics data')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [user])

    if (authLoading || (loading && !analytics)) {
        return (
            <div className="min-h-screen bg-[#eff0ec] flex items-center justify-center text-[#1e2330]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#254f1a] border-t-transparent"></div>
                    <p className="text-sm font-black text-[#1e2330]/70">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#eff0ec] flex items-center justify-center text-[#1e2330] px-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-[#780016]">Error</h2>
                    <p className="mt-2 font-semibold text-[#1e2330]/80">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-full bg-[#1e2330] text-white px-6 py-2.5 text-sm font-black hover:bg-[#254f1a] cursor-pointer transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!analytics) return null

    // Prepare chart data
    const maxClickCount = Math.max(...analytics.dailyActivity.map((d) => d.count), 5)
    const chartHeight = 180

    return (
        <main className="min-h-screen bg-[#eff0ec] px-4 py-12 text-[#1e2330] sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto w-full max-w-5xl space-y-8 z-10 relative">
                {/* Header */}
                <header className="flex flex-col justify-between gap-4 rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#254f1a]">Creator Panel</p>
                        <h1 className="mt-1 text-3xl font-black text-[#254f1a] tracking-tight">Analytics Dashboard</h1>
                        <p className="mt-1 text-sm font-semibold text-[#1e2330]/70">Logged in as @{user?.username}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={`/${user?.username}`}
                            className="rounded-full bg-[#eff0ec] px-5 py-2.5 text-sm font-black text-[#1e2330] hover:bg-[#d2e823] transition duration-200"
                        >
                            View Public Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="rounded-full bg-[#1e2330] px-5 py-2.5 text-sm font-black text-white hover:bg-[#780016] transition duration-200 cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                {/* Metrics Grid */}
                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Links */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center text-[#1e2330]/75">
                            <p className="text-xs font-black uppercase tracking-wider">Total Links</p>
                            <svg className="h-5 w-5 text-[#254f1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-4xl font-black text-[#254f1a]">{analytics.totalLinks}</span>
                            <span className="rounded-full bg-[#d2e823] px-2.5 py-0.5 text-xs font-black text-[#1e2330]">Active</span>
                        </div>
                    </div>

                    {/* Card 2: Total Clicks */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center text-[#1e2330]/75">
                            <p className="text-xs font-black uppercase tracking-wider">Total Clicks</p>
                            <svg className="h-5 w-5 text-[#780016]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-4xl font-black text-[#780016]">{analytics.totalClicks}</span>
                            <span className="text-xs font-semibold text-[#1e2330]/50">All-time</span>
                        </div>
                    </div>

                    {/* Card 3: Average Clicks */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center text-[#1e2330]/75">
                            <p className="text-xs font-black uppercase tracking-wider">Avg. Clicks / Link</p>
                            <svg className="h-5 w-5 text-[#254f1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-4xl font-black text-[#254f1a]">{analytics.averageClicks}</span>
                            <span className="text-xs font-semibold text-[#1e2330]/50">Per Link</span>
                        </div>
                    </div>

                    {/* Card 4: Top Performing Link */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[#1e2330]/75">
                            <p className="text-xs font-black uppercase tracking-wider">Top Performing</p>
                            <svg className="h-5 w-5 text-[#d2e823]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="mt-4 truncate text-lg font-black text-[#254f1a]" title={analytics.topLink}>
                                {analytics.topLink}
                            </h3>
                        </div>
                    </div>
                </section>

                {/* Graph and Performance Table */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* SVG Chart Panel */}
                    <section className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
                        <div>
                            <h2 className="text-xl font-black text-[#254f1a] tracking-tight">Last 7 Days Activity</h2>
                            <p className="text-sm font-semibold text-[#1e2330]/70">Monitor click trends over the past week</p>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <div className="w-full overflow-x-auto">
                                <svg
                                    viewBox="0 0 600 300"
                                    className="min-w-[500px] w-full h-[250px] overflow-visible"
                                >
                                    {/* Grid Lines */}
                                    <line x1="50" y1="50" x2="550" y2="50" className="stroke-[#eff0ec]" strokeWidth="1.5" />
                                    <line x1="50" y1="110" x2="550" y2="110" className="stroke-[#eff0ec]" strokeWidth="1.5" />
                                    <line x1="50" y1="170" x2="550" y2="170" className="stroke-[#eff0ec]" strokeWidth="1.5" />
                                    <line x1="50" y1="230" x2="550" y2="230" className="stroke-[#1e2330]/10" strokeWidth="2.5" />

                                    {/* Y-Axis Labels */}
                                    <text x="35" y="55" className="fill-[#1e2330]/60 text-[10px] text-right font-black">{maxClickCount}</text>
                                    <text x="35" y="145" className="fill-[#1e2330]/60 text-[10px] text-right font-black">{Math.round(maxClickCount / 2)}</text>
                                    <text x="35" y="235" className="fill-[#1e2330]/60 text-[10px] text-right font-black">0</text>

                                    {/* Graph Bars */}
                                    {analytics.dailyActivity.map((day, index) => {
                                        const spacing = 500 / 7
                                        const barWidth = 32
                                        const x = 60 + index * spacing + (spacing - barWidth) / 2
                                        const valueRatio = day.count / maxClickCount
                                        const height = valueRatio * chartHeight
                                        const y = 230 - height

                                        return (
                                            <g key={day.date} className="group cursor-pointer">
                                                {/* Hidden hover trigger region */}
                                                <rect
                                                    x={x - 10}
                                                    y={40}
                                                    width={barWidth + 20}
                                                    height={210}
                                                    className="fill-transparent"
                                                />
                                                {/* Clean solid bar */}
                                                <rect
                                                    x={x}
                                                    y={y}
                                                    width={barWidth}
                                                    height={height}
                                                    rx="9"
                                                    fill="#254f1a"
                                                    className="transition-all duration-200 group-hover:fill-[#d2e823]"
                                                />
                                                {/* Tooltip Count */}
                                                <text
                                                    x={x + barWidth / 2}
                                                    y={y - 8}
                                                    textAnchor="middle"
                                                    className="fill-[#254f1a] text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                >
                                                    {day.count}
                                                </text>
                                                {/* X-Axis Label */}
                                                <text
                                                    x={x + barWidth / 2}
                                                    y="255"
                                                    textAnchor="middle"
                                                    className="fill-[#1e2330]/70 text-[11px] font-black"
                                                >
                                                    {day.date}
                                                </text>
                                            </g>
                                        )
                                    })}
                                </svg>
                            </div>
                        </div>
                    </section>

                    {/* Link Performance Stats */}
                    <section className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-black text-[#254f1a] tracking-tight">Performance</h2>
                                <p className="text-sm font-semibold text-[#1e2330]/70">Click breakdown per resource</p>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                {analytics.linkPerformance.map((link) => {
                                    const percent =
                                        analytics.totalClicks > 0
                                            ? (link.clicks / analytics.totalClicks) * 100
                                            : 0

                                    return (
                                        <div key={link.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-black text-[#254f1a] truncate max-w-[150px]" title={link.title}>
                                                    {link.title}
                                                </span>
                                                <span className="text-xs font-black text-[#780016]">
                                                    {link.clicks} clicks ({percent.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="h-3.5 w-full rounded-full bg-[#eff0ec] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-[#d2e823]"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {analytics.linkPerformance.length === 0 && (
                                    <p className="text-center text-sm font-bold text-[#1e2330]/40 py-8">
                                        No links created yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Analytics
