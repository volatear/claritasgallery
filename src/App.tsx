import { useState, useRef, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────
type Work = {
  id: number
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  img: string
  images?: string[]   // all photos — shown as thumbnails in modal
  description: string
  sold?: boolean
}

type Collection = {
  id: string
  name: string
  label: string
  year: string
  description: string
  cover: string
  works: Work[]
}

type CarouselItem = {
  id: string
  title: string
  series: string
  year: string
  img: string | null   // null = black placeholder (próximamente)
  collectionId: string | null
}

// ─── Data ─────────────────────────────────────────────────────
const CAROUSEL_ITEMS: CarouselItem[] = [
  { id: 'entrevero', title: 'Colección Entrevero',         series: 'Clara Ponce',  year: '2026',     img: '/artworks/ent3-cover.jpg', collectionId: 'entrevero' },
  { id: 'gustos',    title: 'Colección Gustos Personales', series: 'Clara Ponce',  year: 'Sep 2026', img: '/artworks/g-a.jpg',  collectionId: 'gustos'    },
  { id: 'migi',      title: '"Migi, Parasyte"',            series: 'Clara Ponce',  year: 'Sep 2026', img: '/artworks/g-c.jpg',     collectionId: 'gustos'   },
  { id: 'sueltas',   title: 'Obras sueltas',               series: 'Clara Ponce',  year: '2024',     img: '/artworks/arcoiris.jpg', collectionId: 'sueltas'  },
]

const COLLECTIONS: Collection[] = [
  {
    id: 'entrevero',
    name: 'Colección Entrevero',
    label: 'Nuevas adquisiciones',
    year: '2026',
    description: 'Una serie sobre encontrar calma dentro del movimiento. Líneas que se cruzan, se desordenan y parecen perderse, pero que encuentran su propio equilibrio en el recorrido.',
    cover: '/artworks/art2.jpg',
    works: [
      {
        id: 1,
        title: 'Entrevero I',
        artist: 'Clara Ponce',
        year: '2026',
        medium: 'Acrílico y tinta sobre lienzo',
        dimensions: '40 × 50 cm',
        img: '/artworks/ent1-cover.jpg',
        images: ['/artworks/ent1-cover.jpg', '/artworks/art3.jpg', '/artworks/art4.jpg', '/artworks/art5.jpg'],
        description: 'El movimiento como forma de encontrar equilibrio. Una línea que se enreda y se resuelve, como nosotros en la vida misma.',
      },
      {
        id: 2,
        title: 'Entrevero II',
        artist: 'Clara Ponce',
        year: '2026',
        medium: 'Acrílico y tinta sobre lienzo',
        dimensions: '40 × 60 cm',
        img: '/artworks/ent2-cover.jpg',
        images: ['/artworks/ent2-cover.jpg', '/artworks/art6.jpg', '/artworks/art7.jpg'],
        description: 'El gesto circular que busca su propio centro. La mancha negra como punto de gravedad de todo el caos que la rodea.',
      },
      {
        id: 3,
        title: 'Entrevero III',
        artist: 'Clara Ponce',
        year: '2026',
        medium: 'Acrílico y tinta sobre lienzo',
        dimensions: '60 × 80 cm',
        img: '/artworks/ent3-cover.jpg',
        images: ['/artworks/ent3-cover.jpg', '/artworks/ent3-a.jpg', '/artworks/ent3-b.jpg'],
        description: 'El trazo que vuelve sobre sí mismo. Una exploración del ritmo y la tensión entre caos y forma.',
      },
    ],
  },
  {
    id: 'gustos',
    name: 'Colección Gustos Personales',
    label: 'Septiembre',
    year: '2026',
    description: 'Lo que me gusta, lo que me distingue, lo que me hace feliz y el destello de mi personalidad. Colores vivos, trazos desprolijos y vivencias cotidianas.',
    cover: '/artworks/g-a.jpg',
    works: [
      {
        id: 6,
        title: '"Muy rico todo"',
        artist: 'Clara Ponce',
        year: 'Sep 2026',
        medium: 'Acrílico y pastel sobre lienzo',
        dimensions: '40 × 40 cm',
        img: '/artworks/g-a.jpg',
        images: ['/artworks/g-a.jpg', '/artworks/g-b.jpg', '/artworks/g-d.jpg', '/artworks/g-e.jpg'],
        description: 'Una oda al buen comer, al encuentro y a los placeres simples. El texto "Chef was cute, would eat here again" como titular afectivo de una noche que vale la pena recordar. Cada objeto pintado — la Coca, el plato de pasta, la copa, el ketchup — es una memoria que se quedó.',
      },
      {
        id: 7,
        title: '"Migi, Parasyte"',
        artist: 'Clara Ponce — Colección Gustos Personales',
        year: 'Sep 2026',
        medium: 'Acrílico y pastel sobre lienzo',
        dimensions: '40 × 40 cm',
        img: '/artworks/g-c.jpg',
        images: ['/artworks/g-c.jpg', '/artworks/g-f.jpg'],
        description: 'Inspirada en el personaje Migi del anime Parasyte (寄生獣). Una figura con ojo único y boca en el torso, rodeada de tentáculos y manchas rojas. La rareza como forma de cariño: pintar lo que te obsesiona con la misma energía desprolijamente honesta de siempre.',
      },
    ],
  },
  {
    id: 'sueltas',
    name: 'Obras sueltas',
    label: 'Colección',
    year: '2024',
    description: 'Piezas independientes que no pertenecen a ninguna serie. Cada una nació de un impulso distinto.',
    cover: '/artworks/arcoiris.jpg',
    works: [
      {
        id: 8,
        title: 'Arcoiris',
        artist: 'Clara Ponce',
        year: '2024',
        medium: 'Óleo sobre lienzo',
        dimensions: 'Variable',
        img: '/artworks/arcoiris.jpg',
        images: ['/artworks/arcoiris.jpg', '/artworks/arcoiris-b.jpg', '/artworks/arcoiris-c.jpg', '/artworks/arcoiris-d.jpg'],
        description: 'Bloques de color que se apilan y se funden — naranja, malva, amarillo pálido. Una obra que irradia calor sin necesidad de forma.',
        sold: true,
      },
      {
        id: 9,
        title: 'Sol naciente',
        artist: 'Clara Ponce',
        year: '2024',
        medium: 'Tinta y acrílico sobre papel',
        dimensions: 'Variable',
        img: '/artworks/sol-naciente-b.jpg',
        images: ['/artworks/sol-naciente-b.jpg', '/artworks/sol-naciente.jpg'],
        description: 'El sol rojo emerge entre manchas negras y salpicaduras. La energía del gesto, la quietud del círculo. Una pieza que convive con el caos y lo ordena desde adentro.',
        sold: true,
      },
      {
        id: 10,
        title: 'Tiramisu',
        artist: 'Clara Ponce',
        year: '2024',
        medium: 'Acrílico y pan de oro sobre lienzo',
        dimensions: 'Variable',
        img: '/artworks/tiramisu-d.jpg',
        images: ['/artworks/tiramisu-d.jpg', '/artworks/tiramisu-a.jpg', '/artworks/tiramisu-b.jpg', '/artworks/tiramisu-c.jpg'],
        description: 'Una explosión de color en forma de postre. Violeta, azul, ocre, rosa, un cuchillo de plata y dos cerezas rojas. El tiramisu como excusa para pintar todo lo que te da alegría al mismo tiempo.',
        sold: true,
      },
    ],
  },
]

// ─── Carousel config ──────────────────────────────────────────
const CI = CAROUSEL_ITEMS
const CN = CI.length            // 6 items
const CARD_W  = 380             // card width in px
const GAP     = 120             // gap between cards
const STEP    = CARD_W + GAP   // 444px per step
const WINDOW  = 7               // items rendered: center ± 3
const OFFSET  = Math.floor(WINDOW / 2) // 3

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

// ─── Helpers ──────────────────────────────────────────────────
function mod(n: number, m: number) { return ((n % m) + m) % m }

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function FadeUp({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 1s ease ${delay}ms, transform 1s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// ─── SVG Circle Arrow ─────────────────────────────────────────
function CircleArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const R = 30
  const circ = +(2 * Math.PI * R).toFixed(2)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', border: 'none', cursor: 'pointer', padding: 0, width: R * 2 + 4, height: R * 2 + 4, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
    >
      <svg width={R * 2 + 4} height={R * 2 + 4} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={R + 2} cy={R + 2} r={R} fill="none" stroke="rgba(26,26,56,0.10)" strokeWidth="1" />
        <circle
          cx={R + 2} cy={R + 2} r={R} fill="none"
          stroke="rgba(26,26,56,0.55)" strokeWidth="1" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={hovered ? 0 : circ}
          style={{ transformOrigin: `${R + 2}px ${R + 2}px`, transform: 'rotate(-90deg)', transition: hovered ? 'stroke-dashoffset 0.65s cubic-bezier(0.4,0,0.2,1)' : 'stroke-dashoffset 0.25s ease' }}
        />
      </svg>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: hovered ? `translateX(${direction === 'right' ? 4 : -4}px)` : 'translateX(0)', transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          {direction === 'left'
            ? <path d="M10 3L4 8l6 5" stroke="#1a1a38" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            : <path d="M6 3l6 5-6 5" stroke="#1a1a38" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </span>
    </button>
  )
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  // Carousel state
  const [center, setCenter]         = useState(0)    // logical center index (any integer)
  const [trackOff, setTrackOff]     = useState(0)    // extra offset during slide animation
  const [moving, setMoving]         = useState(false) // CSS transition on/off
  const [locked, setLocked]         = useState(false)

  // Page state
  const [heroVisible, setHeroVisible]         = useState(false)
  const [activeCollId, setActiveCollId]       = useState<string | null>(null)
  const [collVisible, setCollVisible]         = useState(false)
  const [activeWork, setActiveWork]           = useState<Work | null>(null)
  const [modalVisible, setModalVisible]       = useState(false)
  const [modalImgIdx, setModalImgIdx]         = useState(0)
  const [sobreOpen, setSobreOpen]             = useState(false)
  const sobreRef = useRef<HTMLElement>(null)
  const [contactOpen, setContactOpen]         = useState(false)
  const [contactVisible, setContactVisible]   = useState(false)
  const [contactWork, setContactWork]         = useState<string | null>(null)
  const [formState, setFormState]             = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent]               = useState(false)

  const [vw, setVw] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1400)
  const collRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Modal animation
  useEffect(() => {
    if (activeWork) requestAnimationFrame(() => setModalVisible(true))
    else setModalVisible(false)
  }, [activeWork])

  // ── Autoplay ─────────────────────────────────────────────────
  const [playing, setPlaying] = useState(true)
  const navigateRef = useRef<(dir: 1 | -1) => void>(() => {})
  const lockedRef   = useRef(false)
  lockedRef.current = locked

  const resetAutoplay = useRef<() => void>(() => {})
  useEffect(() => {
    if (!playing) return
    let id = setInterval(() => { if (!lockedRef.current) navigateRef.current(1) }, 4500)
    resetAutoplay.current = () => { clearInterval(id); id = setInterval(() => { if (!lockedRef.current) navigateRef.current(1) }, 4500) }
    return () => clearInterval(id)
  }, [playing])

  // Navigate carousel — window-offset technique: no snap-back needed
  const navigate = (dir: 1 | -1) => {
    if (locked) return
    resetAutoplay.current()
    setLocked(true)
    setMoving(true)
    setTrackOff(prev => prev - dir * STEP)

    setTimeout(() => {
      setMoving(false)
      setTrackOff(0)
      setCenter(c => c + dir)
      requestAnimationFrame(() => requestAnimationFrame(() => setLocked(false)))
    }, 960)
  }
  navigateRef.current = navigate

  // Track X: center item (at position OFFSET in the 7-item window) is in the middle of vw
  const trackBaseX = vw / 2 - CARD_W / 2 - OFFSET * STEP
  const trackX = trackBaseX + trackOff

  // Window items: logical indices center-3 … center+3
  const windowItems = Array.from({ length: WINDOW }, (_, i) => {
    const logicalIdx = center - OFFSET + i
    return { item: CI[mod(logicalIdx, CN)], logicalIdx, isCenter: i === OFFSET }
  })

  const activeItem = CI[mod(center, CN)]

  // Collection actions
  const enterCollection = (id: string) => {
    setActiveCollId(id)
    setCollVisible(false)
    setTimeout(() => {
      collRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => setCollVisible(true), 220)
    }, 80)
  }

  const closeCollection = () => {
    setCollVisible(false)
    setTimeout(() => { setActiveCollId(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }, 420)
  }

  const closeModal = () => {
    setModalVisible(false)
    setTimeout(() => setActiveWork(null), 320)
  }

  const openContact = (workTitle?: string) => {
    setContactWork(workTitle ?? null)
    setFormSent(false)
    setFormState({ name: '', email: '', message: workTitle ? `Hola, me interesa consultar por "${workTitle}".` : '' })
    setContactOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setContactVisible(true)))
  }

  const closeContact = () => {
    setContactVisible(false)
    setTimeout(() => { setContactOpen(false); setContactWork(null) }, 340)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('https://formsubmit.co/ajax/helloclarasgallery@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: formState.name,
          correo: formState.email,
          mensaje: formState.message,
          _subject: contactWork ? `Consulta por obra: ${contactWork}` : 'Ventas y comisiones — Clara Ponce',
          _captcha: 'false',
        }),
      })
    } catch (_) {
      // show success regardless — message was sent or user has no connection
    }
    setFormSent(true)
  }

  const collection = activeCollId ? COLLECTIONS.find(c => c.id === activeCollId) : null

  return (
    <div className="bg-white min-h-screen overflow-x-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a38' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b" style={{ borderColor: 'rgba(26,26,56,0.07)' }}>
        <div className="max-w-screen-xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
          <img
            src="/logo.png" alt="Clara Ponce" className="h-8 md:h-12 w-auto block flex-shrink-0 cursor-pointer"
            onClick={() => { setActiveCollId(null); setSobreOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            <button
              onClick={() => {
                const next = !sobreOpen
                setSobreOpen(next)
                if (activeCollId) setActiveCollId(null)
                if (next) setTimeout(() => sobreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), activeCollId ? 460 : 50)
              }}
              className="text-xs md:text-sm whitespace-nowrap"
              style={{ opacity: sobreOpen && !activeCollId ? 1 : 0.65, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Sobre mí
            </button>
            <button onClick={() => openContact()} className="text-xs md:text-sm font-medium px-3 py-1.5 md:px-5 md:py-2 rounded-full whitespace-nowrap" style={{ background: '#1a1a38', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Contacto
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="pt-16 min-h-screen flex flex-col">
        {/* Heading */}
        <div className="text-center pt-16 pb-10 px-8">
          <h1
            className="text-[clamp(2.8rem,7.5vw,7rem)] font-bold leading-[1] tracking-tight"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 1.1s ease, transform 1.1s ease' }}
          >
            Mirá de cerca
          </h1>
          <h1
            className="text-[clamp(2.8rem,7.5vw,7rem)] font-light italic leading-[1.05]"
            style={{ ...serif, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 1.1s ease 180ms, transform 1.1s ease 180ms' }}
          >
            cada obra
          </h1>
        </div>

        {/* ── CAROUSEL ────────────────────────────────── */}
        {/* Outer: position:relative, NO overflow:hidden — so arrows are never clipped */}
        <div
          className="relative flex-1 flex flex-col justify-center"
          style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 1s ease 400ms', paddingBottom: '5rem' }}
        >
          {/* Inner: overflow:hidden clips only the track */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                gap: GAP,
                transform: `translateX(${trackX}px)`,
                transition: moving ? 'transform 950ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                willChange: 'transform',
                alignItems: 'flex-start',
              }}
            >
              {windowItems.map(({ item, logicalIdx, isCenter }) => (
                <div key={logicalIdx} style={{ width: CARD_W, flexShrink: 0 }}>
                  {/* Label */}
                  <div style={{ marginBottom: 10, minHeight: 40 }}>
                    {item.img ? (
                      <>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.42, marginBottom: 2 }}>
                          {item.series}
                        </p>
                        <p style={{ fontSize: 13, fontStyle: 'italic', ...serif, opacity: 0.52 }}>
                          {item.title}, {item.year}
                        </p>
                      </>
                    ) : null}
                  </div>
                  {/* Image / placeholder */}
                  <div
                    style={{ aspectRatio: '3/4', background: item.img ? '#f2f1ef' : '#111', overflow: 'hidden', cursor: item.collectionId ? 'pointer' : 'default' }}
                    onClick={() => item.collectionId && enterCollection(item.collectionId)}
                  >
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease', display: 'block' }}
                        onMouseEnter={e => item.collectionId && ((e.target as HTMLImageElement).style.transform = 'scale(1.03)')}
                        onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Próximamente</span>
                      </div>
                    )}
                  </div>
                  {/* CTA hint */}
                  <div style={{ marginTop: 14, height: 18, opacity: item.collectionId ? (isCenter ? 0.6 : 0.32) : 0, transition: 'opacity 0.5s ease' }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Ver colección →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left arrow — outside overflow div, always visible */}
          <div style={{ position: 'absolute', left: 24, top: '46%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <CircleArrow direction="left" onClick={() => navigate(-1)} />
          </div>

          {/* Right arrow */}
          <div style={{ position: 'absolute', right: 24, top: '46%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <CircleArrow direction="right" onClick={() => navigate(1)} />
          </div>

          {/* Dots + play/pause */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
              {CI.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 5,
                    width: mod(center, CN) === i ? 18 : 5,
                    borderRadius: 99,
                    background: mod(center, CN) === i ? '#1a1a38' : 'rgba(26,26,56,0.18)',
                    transition: 'width 0.4s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 14, background: 'rgba(26,26,56,0.15)' }} />

            {/* Play / Pause */}
            <button
              onClick={() => setPlaying(p => !p)}
              aria-label={playing ? 'Pausar reproducción automática' : 'Reanudar reproducción automática'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', opacity: 0.38, transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.75')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.38')}
            >
              {playing ? (
                /* Pause icon */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="3.5" height="10" rx="1" fill="#1a1a38" />
                  <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="#1a1a38" />
                </svg>
              ) : (
                /* Play icon */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 2l9 5-9 5V2z" fill="#1a1a38" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── PLP — todas las obras ───────────────────────── */}
      {!activeCollId && (() => {
        const allWorks = COLLECTIONS.flatMap(c => c.works.map(w => ({ ...w, collectionName: c.name, _collId: c.id })))
        const sorted = [...allWorks.filter(w => !w.sold), ...allWorks.filter(w => w.sold)]
        return (
          <section className="border-t" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
            <div className="max-w-screen-xl mx-auto px-8 py-20">
              <FadeUp>
                <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light italic leading-tight mb-12" style={{ ...serif }}>Todas las obras</h2>
              </FadeUp>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {sorted.map((w, i) => (
                  <FadeUp key={w.id + '-' + w._collId} delay={i * 40}>
                    <div
                      className="group cursor-pointer"
                      onClick={() => { setModalImgIdx(0); setActiveWork(w) }}
                    >
                      <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '3/4', background: '#f2f1ef' }}>
                        <img
                          src={w.img}
                          alt={w.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          style={{ display: 'block' }}
                        />
                        {w.sold && (
                          <span style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', background: 'rgba(26,26,56,0.7)', padding: '3px 7px' }}>
                            Vendida
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-light italic leading-snug mb-0.5" style={{ ...serif, opacity: w.sold ? 0.4 : 0.82 }}>{w.title}</p>
                      <p className="text-[10px] tracking-[0.1em] uppercase" style={{ opacity: 0.32 }}>{w.collectionName}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ── COLLECTION VIEW ─────────────────────────────── */}
      {collection && (
        <section ref={collRef} className="border-t pt-20 pb-32" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
          <div
            className="max-w-screen-xl mx-auto px-8"
            style={{ opacity: collVisible ? 1 : 0, transform: collVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}
          >
            <div className="flex items-start justify-between mb-16">
              <div>
                <button
                  onClick={closeCollection}
                  className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase mb-6 hover:opacity-70 transition-opacity"
                  style={{ opacity: 0.75 }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M11 4L5 8l6 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Volver
                </button>
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ opacity: 0.38 }}>
                  {collection.label} · {collection.year}
                </p>
                <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight mb-4">{collection.name}</h2>
                <p className="max-w-md leading-relaxed text-sm" style={{ opacity: 0.48 }}>{collection.description}</p>
              </div>
              <p className="hidden md:block text-sm pt-2" style={{ opacity: 0.22 }}>{collection.works.length} obras</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
              {collection.works.map((work, i) => (
                <FadeUp key={work.id} delay={i * 55}>
                  <div onClick={() => { setModalImgIdx(0); setActiveWork(work) }} className="group cursor-pointer">
                    <div className="aspect-[4/5] overflow-hidden mb-3 relative" style={{ background: '#f2f1ef' }}>
                      <img
                        src={work.img}
                        alt={work.title}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.8s ease', filter: work.sold ? 'grayscale(0.35)' : 'none' }}
                        onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.03)')}
                        onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                      />
                      {work.sold && (
                        <div className="absolute top-3 left-3">
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', background: 'rgba(26,26,56,0.72)', padding: '4px 8px', backdropFilter: 'blur(4px)' }}>
                            Vendida
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5" style={{ opacity: 0.38 }}>{work.artist}</p>
                    <p className="text-sm italic" style={serif}>{work.title}, {work.year}</p>
                    <p className="text-xs mt-0.5" style={{ opacity: 0.35 }}>{work.medium} · {work.dimensions}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ARTWORK MODAL ───────────────────────────────── */}
      {activeWork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: `rgba(255,255,255,${modalVisible ? 0.94 : 0})`, backdropFilter: 'blur(16px)', transition: 'background 0.32s ease' }}
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto grid md:grid-cols-2"
            style={{ boxShadow: '0 24px 72px rgba(26,26,56,0.10)', opacity: modalVisible ? 1 : 0, transform: modalVisible ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Image panel */}
            <div className="flex flex-col">
              <div className="bg-stone-50 flex items-center justify-center" style={{ minHeight: 420 }}>
                <img
                  src={(activeWork.images ?? [activeWork.img])[modalImgIdx]}
                  alt={activeWork.title}
                  style={{ width: '100%', height: 'auto', display: 'block', opacity: modalVisible ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}
                />
              </div>
              {/* Thumbnails — only when multiple images exist */}
              {activeWork.images && activeWork.images.length > 1 && (
                <div style={{ display: 'flex', gap: 6, padding: '12px 16px 16px' }}>
                  {activeWork.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setModalImgIdx(i)}
                      style={{
                        width: 56, height: 56, flexShrink: 0, padding: 0, border: 'none', cursor: 'pointer',
                        background: '#f2f1ef', overflow: 'hidden',
                        outline: i === modalImgIdx ? '1.5px solid #1a1a38' : '1.5px solid transparent',
                        opacity: i === modalImgIdx ? 1 : 0.45,
                        transition: 'opacity 0.2s ease, outline 0.2s ease',
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-10 flex flex-col">
              <button onClick={closeModal} className="self-end text-xl leading-none mb-8 hover:opacity-50 transition-opacity" style={{ opacity: 0.22 }}>×</button>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ opacity: 0.38 }}>{activeWork.artist}</p>
                {activeWork.sold && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a38', border: '1px solid rgba(26,26,56,0.25)', padding: '3px 7px' }}>
                    Vendida
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-light italic mb-1" style={serif}>{activeWork.title}</h3>
              <p className="text-sm mb-6" style={{ opacity: 0.35 }}>{activeWork.year}</p>
              <div className="space-y-1 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
                <p className="text-xs" style={{ opacity: 0.45 }}>{activeWork.medium}</p>
                <p className="text-xs" style={{ opacity: 0.45 }}>{activeWork.dimensions}</p>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ opacity: 0.55 }}>{activeWork.description}</p>
              <button
                onClick={() => !activeWork.sold && (closeModal(), setTimeout(() => openContact(activeWork?.title), 200))}
                className="mt-8 flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase font-medium transition-opacity"
                style={{ opacity: activeWork.sold ? 0.22 : 0.55, background: 'none', border: 'none', cursor: activeWork.sold ? 'default' : 'pointer', padding: 0 }}
              >
                {activeWork.sold ? 'No disponible' : 'Consultar disponibilidad'}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTACT MODAL ───────────────────────────────── */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={{ background: `rgba(255,255,255,${contactVisible ? 0.92 : 0})`, backdropFilter: 'blur(18px)', transition: 'background 0.34s ease' }}
          onClick={closeContact}
        >
          <div
            className="bg-white w-full max-w-lg"
            style={{
              boxShadow: '0 32px 80px rgba(26,26,56,0.09)',
              opacity: contactVisible ? 1 : 0,
              transform: contactVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ opacity: 0.35 }}>
                    {contactWork ? 'Consulta de obra' : 'Contacto'}
                  </p>
                  <h2 className="text-2xl font-light italic" style={serif}>
                    {contactWork ? contactWork : 'Ventas y comisiones'}
                  </h2>
                </div>
                <button
                  onClick={closeContact}
                  className="text-xl leading-none hover:opacity-50 transition-opacity mt-1"
                  style={{ opacity: 0.22, background: 'none', border: 'none', cursor: 'pointer' }}
                >×</button>
              </div>

              {formSent ? (
                /* Success state */
                <div style={{ opacity: contactVisible ? 1 : 0, transform: contactVisible ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s' }}>
                  <div className="border-t pt-8" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
                    <p className="text-sm leading-relaxed mb-2" style={{ opacity: 0.65 }}>Mensaje recibido.</p>
                    <p className="text-sm leading-relaxed" style={{ opacity: 0.42 }}>Nos comunicaremos con vos a la brevedad.</p>
                  </div>
                  <button
                    onClick={closeContact}
                    className="mt-10 text-[11px] tracking-[0.14em] uppercase font-medium hover:opacity-60 transition-opacity"
                    style={{ opacity: 0.38, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >Cerrar</button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="border-t pt-8" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
                  <div className="space-y-6">
                    {[
                      { key: 'name',  label: 'Nombre',         type: 'text',  placeholder: 'Tu nombre' },
                      { key: 'email', label: 'Correo',         type: 'email', placeholder: 'tu@correo.com' },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ opacity: 0.35 }}>{label}</label>
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={formState[key as keyof typeof formState]}
                          onChange={e => setFormState(s => ({ ...s, [key]: e.target.value }))}
                          className="w-full text-sm outline-none pb-2 bg-transparent"
                          style={{
                            borderBottom: '1px solid rgba(26,26,56,0.14)',
                            color: '#1a1a38',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            transition: 'border-color 0.2s ease',
                          }}
                          onFocus={e => (e.target.style.borderBottomColor = 'rgba(26,26,56,0.6)')}
                          onBlur={e => (e.target.style.borderBottomColor = 'rgba(26,26,56,0.14)')}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ opacity: 0.35 }}>Mensaje</label>
                      <textarea
                        required
                        rows={3}
                        value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="w-full text-sm outline-none resize-none bg-transparent"
                        style={{
                          borderBottom: '1px solid rgba(26,26,56,0.14)',
                          color: '#1a1a38',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={e => (e.target.style.borderBottomColor = 'rgba(26,26,56,0.6)')}
                        onBlur={e => (e.target.style.borderBottomColor = 'rgba(26,26,56,0.14)')}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-10">
                    <button
                      type="button"
                      onClick={closeContact}
                      className="text-[11px] tracking-[0.14em] uppercase hover:opacity-60 transition-opacity"
                      style={{ opacity: 0.28, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >Cancelar</button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase font-medium px-6 py-3 hover:opacity-80 transition-opacity"
                      style={{ background: '#1a1a38', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                      Enviar
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SOBRE MÍ ────────────────────────────────────── */}
      {sobreOpen && !activeCollId && (
        <section ref={sobreRef} className="border-t" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-8 py-24" style={{ display: 'flex', flexDirection: 'row', gap: '6rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Texto */}
            <FadeUp style={{ flex: '1 1 340px', minWidth: 0 }}>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-6" style={{ opacity: 0.35 }}>Sobre la artista</p>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light italic leading-[1.1] mb-8" style={serif}>
                Clara Ponce
              </h2>
              <div className="space-y-5 text-sm leading-relaxed" style={{ opacity: 0.58 }}>
                <p>Soy Clara Ponce, nacida en Buenos Aires, Argentina y creadora de este universo que llamo Clara Art Gallery. Desde muy chica encontré en la expresión visual una forma de conectar con lo más profundo: los colores, las texturas y los gestos sutiles que cuentan historias sin palabras.</p>
                <p>Trabajo hace años en el mundo del contenido, la belleza y la comunicación, colaborando con grandes marcas de beauty, lifestyle y bienestar, y compartiendo en mis redes todo aquello que resalta la belleza en lo cotidiano: los rituales, los hábitos conscientes, los objetos del día a día. Creo profundamente que la estética es una forma de energía: cuando cuidamos lo que nos rodea, también nos cuidamos a nosotros.</p>
                <p>El arte llegó como refugio y se transformó en mi lugar seguro en el mundo. Pinto desde que tengo memoria, crecí en una casa donde papá pintaba y leía mucho, un colegio en donde no la pasaba bien pero predominaba el arte y de alguna manera, siempre me acobijó. Estudié algunos años diseño gráfico y pude empaparme un poco más de la sinergía de la comunicación en otras formas. Cada obra es un fragmento de mi recorrido interior, una invitación a detenerse, a contemplar, a habitar el presente.</p>
                <p>En esta galería conviven mis pinturas, cerámicas y piezas únicas, creadas con materiales nobles y técnicas mixtas que combinan lo ancestral con lo contemporáneo. Cada pieza nace con intención, para acompañar espacios y resonar con quienes buscan algo más que una obra: una historia, una energía, una presencia, algo que haga pensar o sonreír.</p>
                <p style={{ opacity: 0.8 }}>Bienvenida a este espacio donde arte, belleza y alma se encuentran.<br />Gracias por habitarlo conmigo.</p>
              </div>
              <button
                onClick={() => openContact()}
                className="mt-10 flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase font-medium hover:opacity-60 transition-opacity"
                style={{ opacity: 0.75, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Contactar
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
              <div className="flex items-center gap-5 mt-6">
                <a href="https://instagram.com/clarartgallery" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] hover:opacity-60 transition-opacity" style={{ opacity: 0.42, color: 'inherit' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                  @clarartgallery
                </a>
                <a href="https://instagram.com/ponceclari" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] hover:opacity-60 transition-opacity" style={{ opacity: 0.42, color: 'inherit' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                  @ponceclari
                </a>
              </div>
            </FadeUp>
            {/* Foto */}
            <FadeUp delay={120} style={{ flex: '0 0 360px', alignSelf: 'center' }}>
              <img src="/artworks/clara-foto.jpg" alt="Clara Ponce" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────────────── */}
      {!activeCollId && (
        <footer className="border-t py-10" style={{ borderColor: 'rgba(26,26,56,0.08)' }}>
          <div className="max-w-screen-xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <img src="/logo.png" alt="Clara Ponce" style={{ height: 28, width: 'auto', display: 'block' }} />
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/clarartgallery" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity flex items-center gap-2" style={{ color: '#000', fontSize: 13, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                @clarartgallery
              </a>
              <a href="https://instagram.com/ponceclari" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity flex items-center gap-2" style={{ color: '#000', fontSize: 13, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                @ponceclari
              </a>
              <span style={{ width: 1, height: 16, background: 'rgba(26,26,56,0.15)', display: 'inline-block' }} />
              <a href="https://dim.ar/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" style={{ color: '#000', fontSize: 13, fontWeight: 600 }}>
                Hecha por dim.ar
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
