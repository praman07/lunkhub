import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { useHome } from "../hooks/useHome"
import { useAuth } from "../../auth/hooks/useAuth"

const Home = () => {
    const { username } = useParams()
    const { fetchLinks, handleLinkClick, createNewLink } = useHome()
    const { user, logout } = useAuth()
    
    const [links, setLinks] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(true)
    
    // Link creation states
    const [newTitle, setNewTitle] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [addError, setAddError] = useState('')
    const [addLoading, setAddLoading] = useState(false)

    useEffect(() => {
        setLoadingProfile(true)
        fetchLinks({ username })
            .then((fetchedLinks) => {
                setLinks(fetchedLinks.links)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoadingProfile(false)
            })
    }, [username])

    const isOwner = user && user.username === username
    const hasLinks = links.length > 0

    const handleAddLink = async (e) => {
        e.preventDefault()
        setAddError('')

        if (!newTitle || !newUrl) {
            setAddError('Both Title and URL are required')
            return
        }

        let formattedUrl = newUrl.trim()
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`
        }

        setAddLoading(true)
        try {
            const data = await createNewLink({ title: newTitle, url: formattedUrl })
            setLinks((prev) => [...prev, data.link])
            setNewTitle('')
            setNewUrl('')
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to create link')
        } finally {
            setAddLoading(false)
        }
    }

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-[#eff0ec] flex items-center justify-center text-[#1e2330]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#254f1a] border-t-transparent"></div>
                    <p className="text-sm font-black text-[#1e2330]/75">Loading profile...</p>
                </div>
            </div>
        )
    }

    // Generate initials for avatar
    const initials = username ? username.substring(0, 2).toUpperCase() : 'US'

    return (
        <main className="min-h-screen bg-[#eff0ec] px-4 py-12 text-[#1e2330] sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 z-10 relative pb-20">
                {/* Owner Header Bar */}
                {isOwner && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-full bg-white px-6 py-3.5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#254f1a]"></span>
                            <span className="text-xs font-black uppercase tracking-wider text-[#254f1a]">
                                Profile Admin Mode
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/analytics"
                                className="rounded-full bg-[#d2e823] text-[#1e2330] px-5 py-2.5 text-xs font-black hover:scale-[1.01] hover:brightness-[1.05] transition-all"
                            >
                                View Analytics
                            </Link>
                            <button
                                onClick={logout}
                                className="rounded-full bg-[#eff0ec] text-[#1e2330] px-5 py-2.5 text-xs font-black hover:bg-[#780016] hover:text-white transition-all cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                )}

                {/* Profile Header */}
                <section className="overflow-hidden rounded-[32px] bg-white p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-6">
                    {/* Flat Circular Initials Avatar */}
                    <div className="relative w-24 h-24 rounded-full bg-[#254f1a] flex items-center justify-center font-black text-white text-3xl tracking-wider shadow-sm">
                        {initials}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-[#1e2330] sm:text-4xl">
                            @{username}
                        </h1>
                        <p className="text-sm font-semibold text-[#1e2330]/70 max-w-md mx-auto leading-relaxed">
                            Welcome to my personal link sharing page. Click any link below to explore my projects.
                        </p>
                    </div>

                    {/* Social Media Row Mockups */}
                    <div className="flex gap-4 pt-2">
                        {[
                            { name: 'Github', path: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
                            { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                            { name: 'LinkedIn', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' }
                        ].map((soc, i) => (
                            <button
                                key={i}
                                className="w-10 h-10 rounded-full bg-[#eff0ec] flex items-center justify-center text-[#1e2330] hover:bg-[#d2e823] hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                                title={soc.name}
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d={soc.path} />
                                </svg>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Owner: Add New Link Section */}
                {isOwner && (
                    <section className="rounded-[28px] bg-white p-6 shadow-sm border border-slate-100 space-y-4">
                        <h2 className="text-lg font-black text-[#1e2330] tracking-wide">Add New Link</h2>
                        {addError && (
                            <div className="rounded-2xl bg-[#780016] p-3.5 text-xs font-bold text-white">
                                {addError}
                            </div>
                        )}
                        <form onSubmit={handleAddLink} className="grid gap-3.5 sm:grid-cols-5">
                            <div className="sm:col-span-2 relative group">
                                <input
                                    type="text"
                                    placeholder="Link Title (e.g. My Website)"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full rounded-full border-0 bg-[#eff0ec] px-5 py-3.5 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-semibold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition duration-200"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Destination URL (e.g. google.com)"
                                    required
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className="w-full rounded-full border-0 bg-[#eff0ec] px-5 py-3.5 text-sm text-[#1e2330] placeholder-[#1e2330]/40 font-semibold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition duration-200"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addLoading}
                                className="sm:col-span-1 rounded-full bg-[#1e2330] hover:bg-[#254f1a] text-white text-sm font-black transition duration-200 cursor-pointer disabled:opacity-50 py-3.5 hover:-translate-y-px active:scale-[0.97]"
                            >
                                {addLoading ? 'Adding...' : 'Add Link'}
                            </button>
                        </form>
                    </section>
                )}

                {/* Links list */}
                <section className="space-y-4">
                    {hasLinks ? (
                        <div className="grid gap-4">
                            {links.map((link, idx) => (
                                <button
                                    key={link._id}
                                    onClick={() => {
                                        handleLinkClick({ linkId: link._id })
                                        window.open(link.url, '_blank')
                                    }}
                                    className="group relative flex items-center justify-between gap-4 rounded-full bg-white px-6 py-5 shadow-sm border border-slate-100 hover:scale-[1.01] hover:shadow-md transition-all duration-200 text-left cursor-pointer overflow-hidden"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="min-w-0 z-10">
                                        <h2 className="truncate text-md font-black text-[#1e2330] group-hover:text-[#254f1a] transition duration-200">
                                            {link.title}
                                        </h2>
                                        <p className="mt-0.5 truncate text-xs font-semibold text-[#1e2330]/60">
                                            {link.url}
                                        </p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-1 z-10">
                                        <span className="rounded-full bg-[#eff0ec] px-4 py-2 text-xs font-black text-[#1e2330] group-hover:bg-[#d2e823] transition-all duration-200">
                                            Open link
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[32px] bg-white p-12 text-center text-[#1e2330]/50 shadow-sm border border-slate-100">
                            <svg className="mx-auto h-12 w-12 text-[#1e2330]/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <p className="text-sm font-bold">No links found for this profile.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Bottom branding banner for visitors */}
            {!isOwner && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 bg-white border border-slate-100 rounded-full px-5 py-2.5 shadow-lg max-w-[90vw] sm:max-w-md hover:scale-[1.01] transition-all duration-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d2e823]"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#1e2330]">
                        Create your own Kodex page
                    </span>
                    <Link 
                        to="/register" 
                        className="rounded-full bg-[#1e2330] hover:bg-[#254f1a] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.95] hover:-translate-y-px"
                    >
                        Sign Up Free
                    </Link>
                </div>
            )}
        </main>
    )
}

export default Home