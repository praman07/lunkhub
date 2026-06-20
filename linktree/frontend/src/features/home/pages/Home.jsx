import { useEffect, useState } from 'react'
import { useParams } from "react-router"
import { useHome } from "../hooks/useHome"



const Home = () => {

    const { username } = useParams()
    const { fetchLinks, handleLinkClick } = useHome()
    const [ links, setLinks ] = useState([])


    useEffect(() => {
        fetchLinks({ username })
            .then((fetchedLinks) => {
                setLinks(fetchedLinks.links)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const hasLinks = links.length > 0

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_45%,#020617_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
                <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/80">Linktree</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">@{username}</h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                                All of the latest links in one place.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-right">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Links</p>
                            <p className="mt-1 text-2xl font-semibold text-white">{links.length}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    {hasLinks ? (
                        <div className="grid gap-4">
                            {links.map((link) => (
                                <button
                                    key={link._id}
                                    rel="noreferrer"
                                    onClick={() => {
                                        handleLinkClick({ linkId: link._id })
                                        window.open(link.url, '_blank')
                                    }}
                                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/12"
                                >
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold text-white">{link.title}</h2>
                                        <p className="mt-1 truncate text-sm text-slate-300">{link.url}</p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                                        <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                            {link.clicks} clicks
                                        </span>
                                        <span className="text-xs text-slate-400 group-hover:text-cyan-200">Open link</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 shadow-lg backdrop-blur">
                            No links found for this profile.
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Home