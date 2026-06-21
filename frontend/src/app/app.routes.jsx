import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createBrowserRouter, Link, useNavigate } from "react-router"
import Home from "../features/home/pages/Home"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Analytics from "../features/analytics/pages/Analytics"
import { useAuth } from "../features/auth/hooks/useAuth"

// 3D Tilting Card Component for Influencer Grid
const InfluencerCard = ({ inf, idx }) => {
    const [tiltStyle, setTiltStyle] = useState({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: 'none',
        transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out'
    })

    const handleMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        // Tilt degrees capped at 14
        const rotX = -(y / (rect.height / 2)) * 14
        const rotY = (x / (rect.width / 2)) * 14

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
        })
    }

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            boxShadow: 'none',
            transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out'
        })
    }

    return (
        <div
            style={{
                ...tiltStyle,
                transitionDelay: tiltStyle.boxShadow === 'none' ? `${idx * 120}ms` : '0ms'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="reveal tilt-card bg-white border border-slate-100 p-6 rounded-[32px] shadow-lg flex flex-col justify-between relative group cursor-pointer"
        >
            <div className="space-y-4 tilt-card-inner">
                {/* Creator Avatar & Verified Stamp */}
                <div className="flex items-center justify-between">
                    <img src={inf.avatarImg} className="w-12 h-12 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105" alt={inf.name} />
                    <span className="text-[9px] font-black uppercase bg-[#d2e823] text-[#1e2330] px-2 py-0.5 rounded-full tracking-wider">
                        Verified ✓
                    </span>
                </div>

                <div>
                    <h3 className="text-md font-black text-[#1e2330]">{inf.name}</h3>
                    <p className="text-[10px] font-bold text-[#1e2330]/50 uppercase tracking-wider">{inf.role}</p>
                </div>

                <p className="text-xs font-medium text-[#1e2330]/80 leading-relaxed">
                    "{inf.bio}"
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 tilt-card-inner">
                <p className="text-[9px] font-black uppercase text-[#1e2330]/40 tracking-widest">Official Channels:</p>
                <div className="grid gap-1.5">
                    {inf.socials.map((soc) => (
                        <a
                            key={soc.platform}
                            href={soc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-full bg-[#eff0ec]/60 text-[10px] font-black text-[#1e2330] hover:bg-[#d2e823] transition duration-200 hover:-translate-y-px"
                        >
                            <span>{soc.platform}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

// 3D Tilting Card Component for Showcase Section
const ShowcaseCard = ({ children, delay }) => {
    const [tiltStyle, setTiltStyle] = useState({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: 'none',
        transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out'
    })

    const handleMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        // Tilt degrees capped at 12
        const rotX = -(y / (rect.height / 2)) * 12
        const rotY = (x / (rect.width / 2)) * 12

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
        })
    }

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            boxShadow: 'none',
            transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out'
        })
    }

    return (
        <div
            style={{
                ...tiltStyle,
                transitionDelay: tiltStyle.boxShadow === 'none' ? delay : '0ms'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="reveal bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
        >
            {children}
        </div>
    )
}

const LandingPage = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const platformSectionRef = useRef(null)
    const [usernameInput, setUsernameInput] = useState('')
    const [selectedTab, setSelectedTab] = useState('musician')
    const [isAuto, setIsAuto] = useState(true)
    const [activeLinkIndex, setActiveLinkIndex] = useState(0)
    const [faqOpen, setFaqOpen] = useState(null)

    // Platform scroll-lock stepping state
    const [platformStep, setPlatformStep] = useState(0)       // 0=idle, 1..N=showing card, N+1=stacked/done
    const [platformDone, setPlatformDone] = useState(false)   // true after full forward cycle
    const platformStepRef = useRef(0)
    const platformDoneRef = useRef(false)
    const platformLockedRef = useRef(false)
    const wheelCooldownRef = useRef(false)

    // Scroll reveal animation handler
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Wheel-event hijack for Platform Stack (locks outer scroll, steps cards)
    useEffect(() => {
        const TOTAL_STEPS = platforms.length  // 8 cards → steps 1-8, then done
        const COOLDOWN_MS = 700

        const handleWheel = (e) => {
            // After completion, never intercept again
            if (platformDoneRef.current) return

            const section = platformSectionRef.current
            if (!section) return
            const rect = section.getBoundingClientRect()

            // --- If NOT yet locked, check if section is entering viewport (forward only) ---
            if (!platformLockedRef.current) {
                const entering = rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.45
                if (!entering || e.deltaY <= 0) return

                // Lock: prevent page scroll, snap section to center
                e.preventDefault()
                platformLockedRef.current = true
                platformStepRef.current = 1
                setPlatformStep(1)
                const targetY = window.scrollY + rect.top - (window.innerHeight - Math.min(rect.height, window.innerHeight)) / 2
                window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
                return
            }

            // --- Locked: intercept every wheel tick ---
            e.preventDefault()
            if (wheelCooldownRef.current) return
            wheelCooldownRef.current = true
            setTimeout(() => { wheelCooldownRef.current = false }, COOLDOWN_MS)

            if (e.deltaY > 0) {
                // Forward step
                const next = platformStepRef.current + 1
                if (next > TOTAL_STEPS) {
                    // All cards shown → mark complete, unlock
                    platformDoneRef.current = true
                    platformLockedRef.current = false
                    setPlatformDone(true)
                    setPlatformStep(TOTAL_STEPS)
                    return
                }
                platformStepRef.current = next
                setPlatformStep(next)
            } else if (e.deltaY < 0) {
                // Backward step (user scrolling up during animation)
                const next = platformStepRef.current - 1
                if (next <= 0) {
                    // Exit backward, unlock
                    platformLockedRef.current = false
                    platformStepRef.current = 0
                    setPlatformStep(0)
                    return
                }
                platformStepRef.current = next
                setPlatformStep(next)
            }
        }

        window.addEventListener('wheel', handleWheel, { passive: false })
        return () => window.removeEventListener('wheel', handleWheel)
    }, [])

    // Autoplay phone preview tabs
    useEffect(() => {
        if (!isAuto) return

        const tabSequence = ['musician', 'creator', 'business', 'podcast']
        const interval = setInterval(() => {
            setSelectedTab((prev) => {
                const currentIndex = tabSequence.indexOf(prev)
                const nextIndex = (currentIndex + 1) % tabSequence.length
                return tabSequence[nextIndex]
            })
        }, 4000)

        return () => clearInterval(interval)
    }, [isAuto])

    // Autoplay simulation link click highlighter
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLinkIndex((prev) => (prev + 1) % 3)
        }, 1300)
        return () => clearInterval(interval)
    }, [])

    const handleClaim = (e) => {
        e.preventDefault()
        if (usernameInput.trim()) {
            navigate(`/register?username=${usernameInput.trim().toLowerCase()}`)
        }
    }

    const toggleFaq = (index) => {
        setFaqOpen(faqOpen === index ? null : index)
    }

    // Official-Inspired preview themes
    const mockupThemes = {
        musician: {
            bg: 'bg-[#e9c0e9]',
            textColor: 'text-[#1e2330]',
            badgeBg: 'bg-[#780016]',
            badgeText: 'text-white',
            title: '@selenagomez',
            subtitle: 'Verified Artist & Rare Beauty Founder',
            initials: 'SG',
            avatarImg: '/selena_avatar.png',
            links: [
                { title: 'Official TikTok Feed', url: 'https://www.tiktok.com/@selenagomez' },
                { title: 'Instagram Feed', url: 'https://instagram.com/selenagomez' },
                { title: 'Subscribe on YouTube', url: 'https://www.youtube.com/@SelenaGomez' }
            ]
        },
        creator: {
            bg: 'bg-[#254f1a]',
            textColor: 'text-white',
            badgeBg: 'bg-[#d2e823]',
            badgeText: 'text-[#1e2330]',
            title: '@pharrell',
            subtitle: 'Musician & Louis Vuitton Director',
            initials: 'PW',
            avatarImg: '/pharrell_avatar.png',
            links: [
                { title: 'Official YouTube Channel', url: 'https://www.youtube.com/@PharrellWilliams' },
                { title: 'Instagram Portfolio', url: 'https://instagram.com/pharrell' },
                { title: 'Official VEVO Channel', url: 'https://www.youtube.com/user/PharrellVEVO' }
            ]
        },
        business: {
            bg: 'bg-[#1e2330]',
            textColor: 'text-white',
            badgeBg: 'bg-[#eff0ec]',
            badgeText: 'text-[#1e2330]',
            title: '@tonyhawk',
            subtitle: 'Skateboard Legend & Philanthropist',
            initials: 'TH',
            avatarImg: '/tony_avatar.png',
            links: [
                { title: 'Tony Hawk Foundation', url: 'https://instagram.com/tonyhawk' },
                { title: 'Follow on Twitter / X', url: 'https://x.com/tonyhawk' }
            ]
        },
        podcast: {
            bg: 'bg-[#eff0ec]',
            textColor: 'text-[#1e2330]',
            badgeBg: 'bg-[#502274]',
            badgeText: 'text-white',
            title: '@comedycentral',
            subtitle: 'Official Stand-up & Show clips',
            initials: 'CC',
            avatarImg: '/comedy_avatar.png',
            links: [
                { title: 'Viral TikToks', url: 'https://www.tiktok.com/@comedycentral' },
                { title: 'Watch Standup clips', url: 'https://www.youtube.com/user/ComedyCentral' }
            ]
        }
    }

    const currentMockup = mockupThemes[selectedTab]

    const faqs = [
        {
            q: "How does LinkHub work?",
            a: "LinkHub is a custom-branded landing page that groups all your active links, social profiles, online store, and channels in one central hub. Simply copy your LinkHub URL and paste it in your Instagram, TikTok, or YouTube bios."
        },
        {
            q: "Is LinkHub completely free?",
            a: "Yes! Creating your account, adding infinite links, viewing basic analytics charts, and customizing your profile color scheme is 100% free forever."
        },
        {
            q: "Can I monitor profile clicks?",
            a: "Absolutely. Log in to your profile, access the View Analytics dashboard, and track your daily visitor activity, total click counts, and top-performing links."
        }
    ]

    const platforms = [
        {
            name: 'LinkedIn',
            bgColor: 'bg-[#0077B5]',
            svgPath: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
            url: 'https://linkedin.com'
        },
        {
            name: 'YouTube',
            bgColor: 'bg-[#FF0000]',
            svgPath: 'M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
            url: 'https://youtube.com'
        },
        {
            name: 'TikTok',
            bgColor: 'bg-[#000000]',
            svgPath: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.05 1.62 4.2 1.2 1.39 2.92 2.22 4.73 2.4v3.9c-1.63-.03-3.23-.49-4.63-1.32-.38-.23-.74-.49-1.07-.79-.01 2.58-.01 5.17-.01 7.75-.02 1.35-.29 2.7-.93 3.88-1.2 2.25-3.5 3.8-6.05 4.02-3.15.28-6.3-1.28-7.73-4.1-1.33-2.6-.74-5.95 1.4-7.89 1.76-1.57 4.25-2.07 6.45-1.32v4.03c-1.18-.4-2.5-.16-3.48.6-.96.76-1.42 2.01-1.17 3.2.22 1.1 1.09 2.01 2.19 2.24 1.57.34 3.23-.53 3.73-2.03.22-.62.29-1.28.28-1.94V.02z',
            url: 'https://tiktok.com'
        },
        {
            name: 'Instagram',
            bgColor: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
            svgPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
            url: 'https://instagram.com'
        },
        {
            name: 'X / Twitter',
            bgColor: 'bg-[#111111]',
            svgPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
            url: 'https://x.com'
        },
        {
            name: 'Twitch',
            bgColor: 'bg-[#9146FF]',
            svgPath: 'M11.571 4.714h1.715v5.143H11.57zm3.002 0H16.29v5.143h-1.717zm5.143-3.429v12.857h-5.143l-4.286 4.286v-4.286H4.714V1.285zm1.715-1.714H3v16.286h5.143v4.286l4.286-4.286h5.143z',
            url: 'https://twitch.tv'
        },
        {
            name: 'Patreon',
            bgColor: 'bg-[#FF424D]',
            svgPath: 'M22.957 7.21c-.004-3.078-2.584-5.56-5.438-5.56-3.04 0-5.502 2.44-5.502 5.437 0 2.928 2.42 5.314 5.324 5.314 2.9 0 5.62-2.28 5.614-5.19zM0 21.68h3.987V1.65H0z',
            url: 'https://patreon.com'
        },
        {
            name: 'Shopify',
            bgColor: 'bg-[#96bf48]',
            svgPath: 'M19.53 5.33a1.27 1.27 0 0 0-1.2-.67l-2.59.18a3.1 3.1 0 0 0-.52-1.37l1.7-1.7a.89.89 0 0 0-.25-1.45l-3.32-1.12a2.3 2.3 0 0 0-1.89.33L3.25 5.56A2.24 2.24 0 0 0 2.2 7.37L3.9 19.83a2.23 2.23 0 0 0 2.19 1.94h10a2.23 2.23 0 0 0 2.19-1.94L19.9 7.37a2.24 2.24 0 0 0-.37-2.04zM10 2.22l2 .67-2.67 2.67-1.33-1.34zm6.09 17.61a.57.57 0 0 1-.56.5H6.09a.57.57 0 0 1-.56-.5L3.9 7.37a.57.57 0 0 1 .27-.51l8.22-6a.57.57 0 0 1 .47-.08l3.32 1.12a.57.57 0 0 1 .06.37l-1.7 1.7a.57.57 0 0 1-.77-.07zm.81-8.5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75z',
            url: 'https://shopify.com'
        }
    ]

    const [influencers, setInfluencers] = useState([
        {
            name: 'Selena Gomez',
            tag: '@selenagomez',
            role: 'Artist & Rare Beauty Founder',
            avatarImg: '/selena_avatar.png',
            bio: 'Connecting fans worldwide to new music releases, cosmetic lines, and mental health campaigns.',
            socials: [
                { platform: 'Official Twitter / X', url: 'https://twitter.com/selenagomez' },
                { platform: 'Official Instagram', url: 'https://instagram.com/selenagomez' },
                { platform: 'Selena Gomez YouTube Channel', url: 'https://www.youtube.com/@SelenaGomez' }
            ]
        },
        {
            name: 'Pharrell Williams',
            tag: '@pharrell',
            role: 'Musician & Louis Vuitton Director',
            avatarImg: '/pharrell_avatar.png',
            bio: 'Bringing together apparel capsules, creative records, and community initiatives.',
            socials: [
                { platform: 'Official YouTube', url: 'https://www.youtube.com/pharrell' },
                { platform: 'Official Instagram', url: 'https://instagram.com/pharrell' }
            ]
        },
        {
            name: 'Tony Hawk',
            tag: '@tonyhawk',
            role: 'Skateboard Legend & Philanthropist',
            avatarImg: '/tony_avatar.png',
            bio: 'Directing fans to skateboard merchandise, charity updates, and skatepark initiatives.',
            socials: [
                { platform: 'Official Instagram', url: 'https://instagram.com/tonyhawk' },
                { platform: 'Official Twitter / X', url: 'https://twitter.com/tonyhawk' }
            ]
        },
        {
            name: 'Comedy Central',
            tag: '@comedycentral',
            role: 'Official Comedy Network',
            avatarImg: '/comedy_avatar.png',
            bio: 'Directing viewers to the latest stand-up schedules, clips, and trending skits.',
            socials: [
                { platform: 'Comedy Central TikTok', url: 'https://www.tiktok.com/@comedycentral' },
                { platform: 'Comedy Central YouTube', url: 'https://www.youtube.com/@comedycentral' }
            ]
        }
    ])

    useEffect(() => {
        const fetchInfluencerLinks = async () => {
            const usernames = ['selenagomez', 'pharrell', 'tonyhawk', 'comedycentral']
            try {
                const updated = await Promise.all(
                    usernames.map(async (username) => {
                        const res = await fetch(`/api/links/${username}`)
                        if (!res.ok) throw new Error(`Failed to fetch for ${username}`)
                        const data = await res.json()
                        const dbSocials = (data.links || []).map(lnk => ({
                            platform: lnk.title,
                            url: lnk.url
                        }))
                        const baseInfluencer = {
                            'selenagomez': {
                                name: 'Selena Gomez',
                                tag: '@selenagomez',
                                role: 'Artist & Rare Beauty Founder',
                                avatarImg: '/selena_avatar.png',
                                bio: 'Connecting fans worldwide to new music releases, cosmetic lines, and mental health campaigns.'
                            },
                            'pharrell': {
                                name: 'Pharrell Williams',
                                tag: '@pharrell',
                                role: 'Musician & Louis Vuitton Director',
                                avatarImg: '/pharrell_avatar.png',
                                bio: 'Bringing together apparel capsules, creative records, and community initiatives.'
                            },
                            'tonyhawk': {
                                name: 'Tony Hawk',
                                tag: '@tonyhawk',
                                role: 'Skateboard Legend & Philanthropist',
                                avatarImg: '/tony_avatar.png',
                                bio: 'Directing fans to skateboard merchandise, charity updates, and skatepark initiatives.'
                            },
                            'comedycentral': {
                                name: 'Comedy Central',
                                tag: '@comedycentral',
                                role: 'Official Comedy Network',
                                avatarImg: '/comedy_avatar.png',
                                bio: 'Directing viewers to the latest stand-up schedules, clips, and trending skits.'
                            }
                        }[username]
                        return {
                            ...baseInfluencer,
                            socials: dbSocials.length > 0 ? dbSocials : [
                                { platform: 'Official Instagram', url: `https://instagram.com/${username}` }
                            ]
                        }
                    })
                )
                setInfluencers(updated)
            } catch (err) {
                console.error('Error fetching database influencers:', err)
            }
        }
        fetchInfluencerLinks()
    }, [])

    const handleManualTabSelect = (tab) => {
        setIsAuto(false)
        setSelectedTab(tab)
    }

    // Step-driven card styles (replaces old scroll-progress approach)
    const getPlatformCardStyle = (idx) => {
        // After completion: static stacked layout
        if (platformDone) {
            return {
                transform: `translateY(${60 - 16 * idx}px) scale(${1 - 0.04 * idx})`,
                opacity: 1,
                zIndex: 50 - idx,
                pointerEvents: 'auto',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }

        // Idle state (step 0): all cards hidden below
        if (platformStep === 0) {
            return {
                transform: 'translateY(200px) scale(0.7)',
                opacity: 0,
                zIndex: 10,
                pointerEvents: 'none',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }

        const activeIndex = platformStep - 1  // 0-based

        // Last step = all cards shown → stacked
        if (platformStep >= platforms.length) {
            return {
                transform: `translateY(${60 - 16 * idx}px) scale(${1 - 0.04 * idx})`,
                opacity: 1,
                zIndex: 50 - idx,
                pointerEvents: 'auto',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }

        // Active card = centered and scaled up
        if (idx === activeIndex) {
            return {
                transform: 'translateY(60px) scale(1.08)',
                opacity: 1,
                zIndex: 60,
                pointerEvents: 'auto',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }
        // Already seen = slid up and faded
        if (idx < activeIndex) {
            return {
                transform: 'translateY(-80px) scale(0.7)',
                opacity: 0,
                zIndex: 10,
                pointerEvents: 'none',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }
        // Waiting below
        return {
            transform: 'translateY(200px) scale(0.7)',
            opacity: 0,
            zIndex: 10,
            pointerEvents: 'none',
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
        }
    }

    return (
        <main className="min-h-screen bg-white text-[#1e2330] font-sans overflow-x-hidden">
            {/* Dedicated White Navbar - Sticky */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm transition-all duration-200">
                <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="w-5 h-5 rounded-full bg-[#d2e823] animate-pulse-glow"></span>
                        <span className="text-2xl font-black tracking-tighter text-[#1e2330]">linkhub</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to={`/${user.username}`} className="px-5 py-2.5 rounded-full bg-[#eff0ec] text-sm font-black text-[#1e2330] hover:bg-[#1e2330] hover:text-white hover:-translate-y-px active:scale-[0.97] transition-all duration-150 ease-out">
                                    My Dashboard
                                </Link>
                                <button onClick={logout} className="px-5 py-2.5 rounded-full bg-[#780016] text-sm font-black text-white hover:brightness-110 hover:-translate-y-px active:scale-[0.97] transition-all duration-150 ease-out cursor-pointer">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-5 py-2.5 rounded-full bg-[#eff0ec] text-sm font-black text-[#1e2330] hover:bg-[#1e2330] hover:text-white hover:-translate-y-px active:scale-[0.97] transition-all duration-150 ease-out">
                                    Log In
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 rounded-full bg-[#1e2330] text-sm font-black text-white hover:bg-[#254f1a] hover:-translate-y-px active:scale-[0.97] transition-all duration-150 ease-out">
                                    Sign Up Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Grainy Animated Background Hero Section */}
            <section className="w-full grainy-gradient py-16 lg:py-24 border-b border-zinc-900 text-white relative">
                <div className="w-full max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-12 items-center relative z-10">
                    {/* Left Column - Form & Copy */}
                    <div className="lg:col-span-6 space-y-8 text-left reveal active">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                            Everything you are. <br />
                            <span className="text-[#d2e823]">In one simple link.</span>
                        </h1>

                        <p className="text-md sm:text-lg text-zinc-300 max-w-xl leading-relaxed font-semibold">
                            Join millions of creators globally. Share your social handles, online store, music, and blogs in one clean, modern landing page with LinkHub.
                        </p>

                        {/* Claim Username Input */}
                        <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3 max-w-md pt-2">
                            <div className="relative flex-grow">
                                <span className="absolute left-4 top-4 text-zinc-500 font-bold text-sm">linkhub.to/</span>
                                <input
                                    type="text"
                                    placeholder="yourusername"
                                    required
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                    className="w-full rounded-full border border-zinc-800 bg-[#0f1115]/80 py-4 pl-24 pr-4 text-sm text-white placeholder-zinc-600 font-bold focus:outline-none focus:ring-2 focus:ring-[#d2e823] focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-4 rounded-full bg-[#d2e823] text-[#1e2330] font-black hover:bg-white hover:text-[#1e2330] hover:-translate-y-[2px] hover:shadow-md active:scale-[0.97] transition-all duration-150 ease-out cursor-pointer shrink-0"
                            >
                                Claim LinkHub
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Animated Mobile mockup & floating user panels */}
                    <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">
                        {/* Floating user card 1: Selena Gomez (left) */}
                        <div className="hidden sm:flex absolute left-0 top-12 z-20 bg-white border border-slate-100 rounded-[24px] p-4 shadow-xl items-center gap-3.5 max-w-[190px] animate-float-slow hover:scale-105 hover:rotate-1 transition-all duration-300">
                            <img src="/selena_avatar.png" className="w-10 h-10 rounded-full object-cover shadow-inner" alt="Selena Gomez" />
                            <div>
                                <h4 className="text-xs font-black text-[#1e2330]">@selenagomez</h4>
                                <span className="text-[9px] font-bold text-[#780016] bg-[#780016]/10 px-2 py-0.5 rounded-full">Musician</span>
                            </div>
                        </div>

                        {/* Floating user card 2: Pharrell Williams (right) */}
                        <div className="hidden sm:flex absolute right-0 top-36 z-20 bg-white border border-slate-100 rounded-[24px] p-4 shadow-xl items-center gap-3.5 max-w-[190px] animate-float-medium hover:scale-105 hover:-rotate-1 transition-all duration-300">
                            <img src="/pharrell_avatar.png" className="w-10 h-10 rounded-full object-cover shadow-inner" alt="Pharrell Williams" />
                            <div>
                                <h4 className="text-xs font-black text-[#1e2330]">@pharrell</h4>
                                <span className="text-[9px] font-bold text-[#254f1a] bg-[#254f1a]/10 px-2 py-0.5 rounded-full">Artist</span>
                            </div>
                        </div>

                        {/* Floating user card 3: Tony Hawk (bottom left) */}
                        <div className="hidden sm:flex absolute left-6 bottom-4 z-20 bg-white border border-slate-100 rounded-[24px] p-4 shadow-xl items-center gap-3.5 max-w-[190px] animate-float-fast hover:scale-105 hover:rotate-1 transition-all duration-300">
                            <img src="/tony_avatar.png" className="w-10 h-10 rounded-full object-cover shadow-inner" alt="Tony Hawk" />
                            <div>
                                <h4 className="text-xs font-black text-[#1e2330]">@tonyhawk</h4>
                                <span className="text-[9px] font-bold text-[#502274] bg-[#502274]/10 px-2 py-0.5 rounded-full">Skater</span>
                            </div>
                        </div>

                        {/* Centered Phone Preview */}
                        <div className="relative w-full max-w-[270px] aspect-[9/18] rounded-[44px] bg-[#1e2330] p-2.5 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#1e2330] rounded-full z-20"></div>

                            <div className={`w-full h-full rounded-[35px] ${currentMockup.bg} p-4 pt-8 flex flex-col justify-between relative overflow-hidden transition-colors duration-300`}>
                                <div className="w-full flex flex-col items-center gap-2 pt-2">
                                    <img src={currentMockup.avatarImg} className="w-12 h-12 rounded-full object-cover shadow-sm transition-transform duration-300" alt={currentMockup.title} />
                                    <div className="text-center">
                                        <h3 className={`text-xs font-black ${currentMockup.textColor}`}>{currentMockup.title}</h3>
                                        <p className={`text-[9px] ${currentMockup.textColor} opacity-80 font-bold tracking-wide mt-0.5`}>{currentMockup.subtitle}</p>
                                    </div>
                                </div>

                                {/* Dynamic Auto-clicking Link Items inside mockup */}
                                <div className="w-full space-y-2.5 my-auto z-10">
                                    {currentMockup.links.map((lnk, i) => (
                                        <a
                                            key={i}
                                            href={lnk.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`block w-full rounded-full p-2.5 text-center transition-all duration-300 ${i === activeLinkIndex
                                                ? 'bg-[#1e2330] text-white scale-[1.05] shadow-lg border border-[#d2e823]/60'
                                                : 'bg-white text-[#1e2330] hover:scale-[1.02] shadow-sm'
                                                }`}
                                        >
                                            <h4 className="text-[10px] font-black">{lnk.title}</h4>
                                        </a>
                                    ))}
                                </div>

                                <div className="w-full text-center">
                                    <span className={`text-[8px] font-black tracking-widest ${currentMockup.textColor} opacity-60`}>LINKHUB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Selector bar under Hero */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <div className="flex flex-wrap justify-center gap-2 bg-[#eff0ec] p-1.5 rounded-full">
                        {Object.keys(mockupThemes).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleManualTabSelect(tab)}
                                className={`px-5 py-2 rounded-full text-xs font-black capitalize transition-all duration-200 active:scale-[0.95] ${selectedTab === tab
                                    ? 'bg-[#1e2330] text-white -translate-y-px shadow-sm'
                                    : 'text-[#1e2330]/70 hover:bg-white/55'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stack Attack Section (Real Celeb Data Cards Stack) */}
            <section className="bg-[#0f1115] text-white py-24 overflow-hidden border-b border-zinc-900 reveal">
                <div className="max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-12 items-center">
                    {/* Left side: Typography */}
                    <div className="lg:col-span-5 text-left space-y-6">

                        <h2 className="text-4xl sm:text-5xl font-black font-sans tracking-tighter leading-none text-white space-y-2">
                            <span className="block">STACK YOUR LINKS.</span>
                            <span className="block text-zinc-500">DYNAMIC FLOW.</span>
                            <span className="block text-[#d2e823]">CREATIVE HUB.</span>
                        </h2>
                        <p className="text-sm font-semibold text-zinc-400 max-w-sm leading-relaxed">
                            Organize all of your digital networks in a single gorgeous card stack. Hover to expand, scroll to snap together.
                        </p>

                    </div>

                    {/* Right side: Polaroid Fan Out Stack of Real Celeb data */}
                    <div className="lg:col-span-7 flex justify-center items-center">
                        <div className="stack-container">
                            {/* Card 1: Selena Gomez */}
                            <div className="stack-card stack-card-1">
                                <img src="/selena_avatar.png" className="w-full aspect-[4/3] object-cover rounded-md mb-2.5" alt="Selena Gomez" />
                                <span className="text-[10px] font-bold text-zinc-400 block tracking-wider">SELENA GOMEZ</span>
                                <span className="text-xs font-black text-[#1e2330]">Verified Profile</span>
                            </div>

                            {/* Card 2: Pharrell Williams */}
                            <div className="stack-card stack-card-2">
                                <img src="/pharrell_avatar.png" className="w-full aspect-[4/3] object-cover rounded-md mb-2.5" alt="Pharrell Williams" />
                                <span className="text-[10px] font-bold text-zinc-400 block tracking-wider">PHARRELL WILLIAMS</span>
                                <span className="text-xs font-black text-[#1e2330]">Verified Profile</span>
                            </div>

                            {/* Card 3: Tony Hawk */}
                            <div className="stack-card stack-card-3">
                                <img src="/tony_avatar.png" className="w-full aspect-[4/3] object-cover rounded-md mb-2.5" alt="Tony Hawk" />
                                <span className="text-[10px] font-bold text-zinc-400 block tracking-wider">TONY HAWK</span>
                                <span className="text-xs font-black text-[#1e2330]">Verified Profile</span>
                            </div>

                            {/* Card 4: Comedy Central */}
                            <div className="stack-card stack-card-4">
                                <img src="/comedy_avatar.png" className="w-full aspect-[4/3] object-cover rounded-md mb-2.5" alt="Comedy Central" />
                                <span className="text-[10px] font-bold text-zinc-400 block tracking-wider">COMEDY CENTRAL</span>
                                <span className="text-xs font-black text-[#1e2330]">Official Brand Page</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Integration Section (Wheel-locked step-through) */}
            <section
                ref={platformSectionRef}
                className="relative w-full min-h-screen bg-white border-b border-slate-100 flex flex-col justify-center items-center py-24 overflow-hidden"
            >
                <div className="max-w-2xl text-center space-y-4 px-6 mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#eff0ec] text-xs font-black uppercase tracking-wider text-[#1e2330]">
                        Integrations
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1e2330] tracking-tight">
                        LinkHub supports all platforms
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#1e2330]/60">
                        {platformDone ? 'All platforms connected.' : 'Scroll to cycle through apps.'}
                    </p>
                </div>

                {/* Step counter indicator */}
                {!platformDone && platformStep > 0 && (
                    <div className="flex gap-1.5 mb-6">
                        {platforms.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i < platformStep ? 'w-6 bg-[#1e2330]' : 'w-1.5 bg-[#1e2330]/20'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Interactive Stack Wrapper */}
                <div className="platform-stack-container">
                    {platforms.map((plat, idx) => (
                        <a
                            key={plat.name}
                            href={plat.url}
                            target="_blank"
                            rel="noreferrer"
                            style={getPlatformCardStyle(idx)}
                            className={`platform-stack-card ${plat.bgColor} text-white flex flex-col justify-between`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black tracking-tighter uppercase">{plat.name}</span>
                                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">
                                    Active
                                </span>
                            </div>

                            <div className="flex justify-center my-auto">
                                <svg className="h-14 w-14 fill-current text-white" viewBox="0 0 24 24">
                                    <path d={plat.svgPath} />
                                </svg>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-80">
                                <span>LinkHub Sync</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Verified Influencers/Creators Section - 3D tilting cards */}
            <section className="w-full py-24 bg-[#e5eedc] border-b border-[#cde0c0] reveal">
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#254f1a] text-xs font-black uppercase tracking-wider text-white">
                            Creators Hub
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-[#1e2330] tracking-tight">
                            Loved by the world's top talent
                        </h2>
                        <p className="text-sm font-semibold text-[#1e2330]/60">
                            Hover over cards to activate the 3D depth controller.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 perspective-1000">
                        {influencers.map((inf, idx) => (
                            <InfluencerCard key={inf.name} inf={inf} idx={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="w-full bg-[#eff0ec]/50 py-12 text-[#1e2330] reveal">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1e2330]/60">Trusted by over 70 million creators</p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black">
                        {['comedycentral', 'hbo', 'selenagomez', 'pharrell', 'tonyhawk', 'laclippers'].map((name) => (
                            <Link key={name} to={`/${name}`} className="px-5 py-2.5 rounded-full bg-white text-[#1e2330] hover:-translate-y-[2px] hover:shadow-md hover:bg-[#d2e823] hover:text-[#1e2330] active:scale-[0.97] transition-all duration-200">
                                /{name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creator Showcase Gallery (Real Celeb Showcase Cards) */}
            <section className="w-full py-20 lg:py-28 bg-[#eff0ec] border-b border-slate-200/60 reveal">
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-4xl lg:text-5xl font-black text-[#1e2330] tracking-tight leading-tight">
                            One link to rule them all.
                        </h2>
                        <p className="text-sm font-semibold text-[#1e2330]/60">Explore some of our active creators page layouts</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Creator Card 1: Selena Gomez */}
                        <ShowcaseCard delay="0ms">
                            <div className="flex items-center gap-4 mb-6">
                                <img src="/selena_avatar.png" className="w-12 h-12 rounded-full object-cover shadow-sm animate-pulse-glow" alt="Selena Gomez" />
                                <div>
                                    <h3 className="text-lg font-black text-[#1e2330]">Selena Gomez</h3>
                                    <p className="text-xs font-bold text-[#1e2330]/60">Singer & Artist</p>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-[#1e2330]/75 leading-relaxed mb-6">
                                Selena connects her TikTok, Instagram, and YouTube channel inside one clean aesthetic profile page.
                            </p>
                            <div className="space-y-2">
                                <a href="https://www.tiktok.com/@selenagomez" target="_blank" rel="noreferrer" className="block w-full text-center p-3 rounded-full bg-white border border-slate-100 text-xs font-black text-[#1e2330] hover:bg-[#1e2330] hover:text-white transition duration-200">
                                    TikTok
                                </a>
                                <Link to="/selenagomez" className="block w-full text-center p-3 rounded-full bg-[#d2e823] text-xs font-black text-[#1e2330] hover:scale-[1.02] transition duration-200">
                                    View Full Profile
                                </Link>
                            </div>
                        </ShowcaseCard>

                        {/* Creator Card 2: Pharrell Williams */}
                        <ShowcaseCard delay="150ms">
                            <div className="flex items-center gap-4 mb-6">
                                <img src="/pharrell_avatar.png" className="w-12 h-12 rounded-full object-cover shadow-sm animate-pulse-glow" alt="Pharrell Williams" />
                                <div>
                                    <h3 className="text-lg font-black text-[#1e2330]">Pharrell Williams</h3>
                                    <p className="text-xs font-bold text-[#1e2330]/60">Musician & Designer</p>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-[#1e2330]/75 leading-relaxed mb-6">
                                Pharrell organizes his music albums, Instagram portfolio, and fashion releases using our high-contrast layout.
                            </p>
                            <div className="space-y-2">
                                <a href="https://www.youtube.com/@PharrellWilliams" target="_blank" rel="noreferrer" className="block w-full text-center p-3 rounded-full bg-white border border-slate-100 text-xs font-black text-[#1e2330] hover:bg-[#1e2330] hover:text-white transition duration-200">
                                    YouTube
                                </a>
                                <Link to="/pharrell" className="block w-full text-center p-3 rounded-full bg-[#d2e823] text-xs font-black text-[#1e2330] hover:scale-[1.02] transition duration-200">
                                    View Full Profile
                                </Link>
                            </div>
                        </ShowcaseCard>

                        {/* Creator Card 3: Tony Hawk */}
                        <ShowcaseCard delay="300ms">
                            <div className="flex items-center gap-4 mb-6">
                                <img src="/tony_avatar.png" className="w-12 h-12 rounded-full object-cover shadow-sm animate-pulse-glow" alt="Tony Hawk" />
                                <div>
                                    <h3 className="text-lg font-black text-[#1e2330]">Tony Hawk</h3>
                                    <p className="text-xs font-bold text-[#1e2330]/60">Skateboarding Icon</p>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-[#1e2330]/75 leading-relaxed mb-6">
                                Tony links his foundation updates, shop merchandise, and Twitter feed within a singular brand link.
                            </p>
                            <div className="space-y-2">
                                <a href="https://x.com/tonyhawk" target="_blank" rel="noreferrer" className="block w-full text-center p-3 rounded-full bg-white border border-slate-100 text-xs font-black text-[#1e2330] hover:bg-[#1e2330] hover:text-white transition duration-200">
                                    Twitter / X
                                </a>
                                <Link to="/tonyhawk" className="block w-full text-center p-3 rounded-full bg-[#d2e823] text-xs font-black text-[#1e2330] hover:scale-[1.02] transition duration-200">
                                    View Full Profile
                                </Link>
                            </div>
                        </ShowcaseCard>
                    </div>
                </div>
            </section>

            {/* Burgundy Accordion FAQs */}
            <section className="bg-[#780016] text-[#eff0ec] py-20 reveal">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-sm font-bold text-white/70">Got questions? We've got answers.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border-b border-white/20 pb-4 cursor-pointer group"
                                onClick={() => toggleFaq(idx)}
                            >
                                <div className="flex justify-between items-center py-4 group-hover:opacity-90 transition-opacity">
                                    <h3 className="text-md sm:text-lg font-black">{faq.q}</h3>
                                    <span className="text-xl font-black">
                                        <svg
                                            className={`h-5 w-5 stroke-current fill-none transform transition-transform duration-300 ${faqOpen === idx ? 'rotate-180' : 'rotate-0'}`}
                                            viewBox="0 0 24 24"
                                            strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${faqOpen === idx ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-sm font-semibold text-white/80 leading-relaxed pt-1.5">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / CTA block: Indigo */}
            <section className="bg-[#502274] text-[#eff0ec] py-20 text-center reveal">
                <div className="max-w-4xl mx-auto px-6 space-y-8">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                        Jumpstart your corner of the internet today
                    </h2>
                    <p className="text-md sm:text-lg font-semibold text-white/80 max-w-xl mx-auto leading-relaxed">
                        Claim your unique username, organize your online life, and start exploring user clicks in under one minute.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/register"
                            className="inline-block px-10 py-5 rounded-full bg-[#d2e823] text-[#1e2330] font-black hover:-translate-y-[3px] hover:shadow-2xl active:scale-[0.97] transition-all duration-150 ease-out cursor-pointer"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Premium Interactive Footer */}
            <footer className="bg-[#191d28] border-t border-zinc-800 text-slate-400 py-12 font-sans">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link to="/" className="text-xl font-black tracking-tight text-white hover:opacity-90">
                            LinkHub
                        </Link>
                        <p className="text-[11px] font-semibold text-slate-500 text-center md:text-left">
                            The professional link-in-bio portfolio for digital creators.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-400">
                        <Link to="/register" className="hover:text-white transition">Get Started</Link>
                        <Link to="/login" className="hover:text-white transition">Admin Panel</Link>
                        <Link to="/selenagomez" className="hover:text-white transition">Selena Gomez</Link>
                        <Link to="/pharrell" className="hover:text-white transition">Pharrell Williams</Link>
                        <Link to="/tonyhawk" className="hover:text-white transition">Tony Hawk</Link>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-zinc-800/40 text-center text-[10px] font-semibold text-slate-600">
                    <p>© {new Date().getFullYear()} LinkHub. All rights reserved. Built for creators worldwide.</p>
                </div>
            </footer>
        </main>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/analytics",
        element: <Analytics />
    },
    {
        path: "/:username",
        element: <Home />
    }
])

export default router