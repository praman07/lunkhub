import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { useHome } from "../hooks/useHome"
import { useAuth } from "../../auth/hooks/useAuth"

const Home = () => {
    const { username } = useParams()
    const { fetchLinks, handleLinkClick, createNewLink, modifyLink, removeLink } = useHome()
    const { user, logout } = useAuth()
    
    const [links, setLinks] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(true)
    
    // Link creation states
    const [newTitle, setNewTitle] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [addError, setAddError] = useState('')
    const [addLoading, setAddLoading] = useState(false)

    // Inline editing states
    const [editingLinkId, setEditingLinkId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editUrl, setEditUrl] = useState('')
    const [editError, setEditError] = useState('')
    const [editLoading, setEditLoading] = useState(false)

    const [copied, setCopied] = useState(false)

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

    const handleCopyLink = () => {
        const absoluteUrl = `${window.location.origin}/${username}`
        navigator.clipboard.writeText(absoluteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSaveEdit = async (linkId) => {
        if (!editTitle || !editUrl) {
            setEditError('Title and URL are required')
            return
        }

        let formattedUrl = editUrl.trim()
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`
        }

        setEditLoading(true)
        try {
            await modifyLink({ linkId, title: editTitle, url: formattedUrl })
            setLinks((prev) =>
                prev.map((l) =>
                    l._id === linkId ? { ...l, title: editTitle, url: formattedUrl } : l
                )
            )
            setEditingLinkId(null)
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update link')
        } finally {
            setEditLoading(false)
        }
    }

    const handleDeleteLink = async (linkId) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return
        try {
            await removeLink({ linkId })
            setLinks((prev) => prev.filter((l) => l._id !== linkId))
        } catch (err) {
            console.error(err)
            alert('Failed to delete link')
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

    const avatarMap = {
        selenagomez: '/selena_avatar.png',
        pharrell: '/pharrell_avatar.png',
        tonyhawk: '/tony_avatar.png',
        comedycentral: '/comedy_avatar.png',
        hbo: '/hbo_avatar.png',
        laclippers: '/laclippers_avatar.png'
    }
    const avatarUrl = avatarMap[username?.toLowerCase()]

    return (
        <main className="min-h-screen bg-[#eff0ec] px-4 py-12 text-[#1e2330] sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 z-10 relative pb-20">
                {/* Owner Header Bar */}
                {isOwner && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl bg-white px-6 py-4 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#254f1a]">
                                Profile Admin Mode
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
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
                    {/* Flat Circular Initials Avatar or Real Avatar Image */}
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            className="w-24 h-24 rounded-full object-cover shadow-sm border border-slate-100"
                            alt={username}
                        />
                    ) : (
                        <div className="relative w-24 h-24 rounded-full bg-[#254f1a] flex items-center justify-center font-black text-white text-3xl tracking-wider shadow-sm">
                            {initials}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-[#1e2330] sm:text-4xl">
                            @{username}
                        </h1>
                        <p className="text-sm font-semibold text-[#1e2330]/70 max-w-md mx-auto leading-relaxed">
                            Welcome to my personal portfolio. Below you will find my projects, verified contact methods, and digital integrations.
                        </p>
                    </div>
                </section>

                {/* Share Profile Bio Link Card */}
                {isOwner && (
                    <section className="rounded-[28px] bg-black p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Your Live LinkHub Profile is Active</h2>
                        </div>
                        <p className="text-xs font-semibold text-lime-200 leading-relaxed">
                            Copy this link and paste it into your Instagram, Twitter/X, or TikTok bio to direct your audience to this portfolio.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <div className="flex-grow bg-[#eff0ec] rounded-full px-5 py-3.5 text-xs font-bold text-[#1e2330] border border-slate-200/50 flex items-center justify-between select-all truncate">
                                <span>{`${window.location.origin}/${username}`}</span>
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className="px-6 py-3.5 rounded-full bg-[#d2e823] text-[#1e2330] text-xs font-black transition-all hover:scale-[1.02] hover:brightness-[1.08] active:scale-[0.98] cursor-pointer shadow-md shrink-0"
                            >
                                {copied ? 'Copied! ✓' : 'Copy Bio Link'}
                            </button>
                        </div>
                    </section>
                )}

                {/* Owner: Add New Link Section */}
                {isOwner && (
                    <section className="rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-[#1e2330] uppercase tracking-wider">Add to Portfolio</h2>
                        </div>
                        {addError && (
                            <div className="rounded-2xl bg-[#780016] p-3.5 text-xs font-bold text-white">
                                {addError}
                            </div>
                        )}
                        <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Link Title (e.g. My Website)"
                                required
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="flex-1 rounded-full border-0 bg-[#eff0ec] px-5 py-3 text-xs text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition duration-200"
                            />
                            <input
                                type="text"
                                placeholder="Destination URL (e.g. google.com)"
                                required
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="flex-1 rounded-full border-0 bg-[#eff0ec] px-5 py-3 text-xs text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition duration-200"
                            />
                            <button
                                type="submit"
                                disabled={addLoading}
                                className="rounded-full bg-[#1e2330] hover:bg-[#254f1a] text-white px-6 py-3 text-xs font-black transition duration-200 cursor-pointer disabled:opacity-50 hover:-translate-y-px active:scale-[0.97]"
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
                            {links.map((link, idx) => {
                                return isOwner ? (
                                    <div 
                                        key={link._id}
                                        className="group relative flex items-center justify-between gap-4 rounded-full bg-white px-6 py-4 shadow-sm border border-slate-100 hover:scale-[1.01] hover:shadow-md transition-all duration-200 text-left"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        {editingLinkId === link._id ? (
                                            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                                                <div className="flex-grow grid gap-2 sm:grid-cols-2 w-full">
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="w-full rounded-full border-0 bg-[#eff0ec] px-5 py-2.5 text-xs text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition"
                                                        placeholder="Link Title"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editUrl}
                                                        onChange={(e) => setEditUrl(e.target.value)}
                                                        className="w-full rounded-full border-0 bg-[#eff0ec] px-5 py-2.5 text-xs text-[#1e2330] placeholder-[#1e2330]/40 font-bold focus:outline-none focus:ring-2 focus:ring-[#254f1a] transition"
                                                        placeholder="Destination URL"
                                                    />
                                                </div>
                                                {editError && <p className="text-[10px] font-bold text-[#780016] px-1">{editError}</p>}
                                                <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                                                    <button
                                                        onClick={() => setEditingLinkId(null)}
                                                        className="rounded-full bg-[#eff0ec] hover:bg-slate-200 text-[#1e2330] px-3.5 py-1.5 text-[10px] font-black transition duration-150 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveEdit(link._id)}
                                                        disabled={editLoading}
                                                        className="rounded-full bg-[#d2e823] text-[#1e2330] px-3.5 py-1.5 text-[10px] font-black hover:scale-[1.01] hover:brightness-[1.05] transition duration-150 cursor-pointer"
                                                    >
                                                        {editLoading ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div 
                                                    className="min-w-0 flex-grow cursor-pointer" 
                                                    onClick={() => {
                                                        handleLinkClick({ linkId: link._id })
                                                        window.open(link.url, '_blank')
                                                    }}
                                                >
                                                    <h2 className="truncate text-sm font-black text-[#1e2330] group-hover:text-[#254f1a] transition duration-200">
                                                        {link.title}
                                                    </h2>
                                                    <p className="mt-0.5 truncate text-[10px] font-semibold text-[#1e2330]/60">
                                                        {link.url}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingLinkId(link._id)
                                                            setEditTitle(link.title)
                                                            setEditUrl(link.url)
                                                            setEditError('')
                                                        }}
                                                        className="rounded-full bg-slate-100 hover:bg-[#d2e823] px-3.5 py-1.5 text-[10px] font-black text-[#1e2330] transition duration-150 cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLink(link._id)}
                                                        className="rounded-full bg-[#eff0ec] hover:bg-[#780016] hover:text-white px-3.5 py-1.5 text-[10px] font-black text-[#780016] transition duration-150 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
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
                                )
                            })}
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
                    <span className="text-xs font-black uppercase tracking-wider text-[#1e2330]">
                        Create your own LinkHub page
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