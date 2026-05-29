import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import {
  FiArrowRight,
  FiBook,
  FiChevronDown,
  FiClock,
  FiGlobe,
  FiMenu,
  FiMapPin,
  FiMail,
  FiSearch,
  FiPhoneCall,
  FiTarget,
  FiX,
} from 'react-icons/fi'
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineShieldCheck,
} from 'react-icons/hi'
import {
  RiBrainLine,
  RiCalendarCheckLine,
  RiLightbulbFlashLine,
  RiMedalLine,
  RiNotification2Line,
  RiParentLine,
  RiPlantLine,
  RiPuzzleLine,
  RiTeamLine,
} from 'react-icons/ri'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { FaStar } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const navItems = [
  'Home',
  'About',
  'Activities',
  'Progress',
  'Testimonials',
  'Pricing',
  'Contact',
]

const trustCards = [
  {
    title: 'Expert Designed',
    icon: RiBrainLine,
    desc: 'Built by early-learning specialists with age-wise progression paths.',
  },
  {
    title: 'Science Backed',
    icon: HiOutlineShieldCheck,
    desc: 'Grounded in developmental neuroscience and toddler behavior research.',
  },
  {
    title: 'Easy At Home',
    icon: RiPlantLine,
    desc: 'Fits naturally into your home routine with minimal setup.',
  },
  {
    title: 'Short Daily Activities',
    icon: HiOutlineClock,
    desc: 'Designed as 10-20 minute rituals to build consistency without stress.',
  },
  {
    title: 'No Expensive Materials',
    icon: RiLightbulbFlashLine,
    desc: 'Uses safe, affordable, everyday household materials.',
  },
  {
    title: 'Child Safe Learning',
    icon: HiOutlineHeart,
    desc: 'Safety-first prompts and clear parent guidance in every activity.',
  },
]

const steps = [
  'Choose Child Age',
  'Get Personalized Activities',
  'Do Guided Play Activities',
  'Track Child Progress',
]

const domains = [
  {
    title: 'Cognitive Skills',
    desc: 'Pattern thinking, early logic, and memory games.',
    icon: RiPuzzleLine,
  },
  {
    title: 'Motor Skills',
    desc: 'Fine and gross motor confidence through playful movement.',
    icon: FiTarget,
  },
  {
    title: 'Sensory Learning',
    desc: 'Touch, sound, and visual exploration for brain mapping.',
    icon: RiLightbulbFlashLine,
  },
  {
    title: 'Emotional Growth',
    desc: 'Bonding rituals, empathy prompts, and calm moments.',
    icon: HiOutlineHeart,
  },
  {
    title: 'Communication',
    desc: 'Language prompts, early speech habits, and stories.',
    icon: RiTeamLine,
  },
  {
    title: 'Self Care',
    desc: 'Tiny independent routines that build confidence.',
    icon: RiMedalLine,
  },
]

const activities = [
  {
    id: 1,
    category: 'Cognitive',
    title: 'Color Basket Match',
    age: '18-24 months',
    difficulty: 'Easy',
    duration: '12 min',
    benefits: 'Object recognition and sorting',
    materials: 'Colored bowls and soft blocks',
    image: '/images/activity-play.png',
    steps: ['Pick one color', 'Ask child to match', 'Celebrate each win'],
    outcomes: 'Improves pattern mapping and visual memory.',
    tips: 'Use warm encouragement and no corrections at first.',
    safety: 'Avoid small choking-size objects.',
  },
  {
    id: 2,
    category: 'Motor',
    title: 'Tape Line Walk',
    age: '24-36 months',
    difficulty: 'Medium',
    duration: '15 min',
    benefits: 'Balance and body awareness',
    materials: 'Painter tape',
    image: '/images/hero-family.jpeg',
    steps: ['Create a line path', 'Walk heel to toe', 'Add turns and pause points'],
    outcomes: 'Strengthens core control and coordination.',
    tips: 'Model once, then let child lead pace.',
    safety: 'Keep floor dry and uncluttered.',
  },
  {
    id: 3,
    category: 'Emotional',
    title: 'Feelings Mirror Time',
    age: '24-36 months',
    difficulty: 'Easy',
    duration: '10 min',
    benefits: 'Emotion naming and empathy',
    materials: 'Mirror and emotion flashcards',
    image: '/images/about-learning.jpeg',
    steps: ['Show a card', 'Copy face in mirror', 'Say the feeling aloud'],
    outcomes: 'Builds social language and emotional regulation.',
    tips: 'Use your own stories to make it personal.',
    safety: 'Use shatter-safe mirror only.',
  },
  {
    id: 4,
    category: 'Sensory',
    title: 'Texture Treasure Tray',
    age: '18-30 months',
    difficulty: 'Medium',
    duration: '20 min',
    benefits: 'Sensory integration and focus',
    materials: 'Rice, cloth, sponge, wooden ring',
    image: '/images/learning-day.jpg',
    steps: ['Hide items in tray', 'Invite touch exploration', 'Name each texture'],
    outcomes: 'Expands sensory vocabulary and tactile confidence.',
    tips: 'Keep calm music and soft lighting.',
    safety: 'Supervise closely; avoid small loose items for younger toddlers.',
  },
]

const testimonials = [
  {
    name: 'Aadhya Sharma',
    age: 'Mom of 2.4 year old',
    quote:
      'SpacECE gave us calm and meaningful daily routines. My son now asks for activity time every morning.',
    image: '/images/child.jpg',
  },
  {
    name: 'Meera Nair',
    age: 'Mom of 18 month old',
    quote:
      'The progress tracker helped us notice tiny milestones we were missing. It feels scientific yet very human.',
    image: '/images/about-learning.jpeg',
  },
  {
    name: 'Ritika Sen',
    age: 'Mom of twins',
    quote:
      'Premium quality activities without expensive kits. The guidance style feels warm, gentle, and trustworthy.',
    image: '/images/hero-family.jpeg',
  },
]

const faqs = [
  {
    q: 'Is this program suitable for first-time parents?',
    a: 'Yes. Every activity has guided steps, parent tips, and safety notes that make home learning easy and stress free.',
  },
  {
    q: 'How much time do we need daily?',
    a: 'Most activities take 10 to 20 minutes and can be combined with everyday routines.',
  },
  {
    q: 'Do I need expensive toys or kits?',
    a: 'No. SpacECE is designed around safe, low-cost materials already found in most homes.',
  },
  {
    q: 'Can I track growth over months?',
    a: 'Yes. You get timeline-based progress across cognitive, emotional, speech, and independence milestones.',
  },
]

function SectionHeading({ badge, title, subtitle }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 inline-flex rounded-full border border-[#F4A300]/30 bg-white/70 px-4 py-1 text-sm font-semibold text-[#1E1E1E] shadow-sm backdrop-blur">
        {badge}
      </p>
      <h2 className="font-heading text-3xl font-bold text-[#1E1E1E] md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-[#666666] md:text-lg">{subtitle}</p>
    </div>
  )
}

function CTAButton({ children, outline = false, icon = true, href = '#activities' }) {
  const classes = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 md:text-base ${
    outline
      ? 'border border-[#1E1E1E]/20 bg-white/60 text-[#1E1E1E] hover:-translate-y-0.5 hover:border-[#1E1E1E]'
      : 'bg-gradient-to-r from-[#F4A300] via-[#f0b33d] to-[#ffbf52] text-[#1E1E1E] shadow-[0_12px_30px_-12px_rgba(244,163,0,.75)] hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_rgba(244,163,0,.8)]'
  }`

  return (
    <a href={href} className={classes}>
      {children}
      {icon && <FiArrowRight />}
    </a>
  )
}

function App() {
  const [activeNav, setActiveNav] = useState('Home')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [faqOpen, setFaqOpen] = useState(0)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [progress, setProgress] = useState(0)
  const [mouseGlow, setMouseGlow] = useState({ x: 0, y: 0 })

  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80 })

    const sections = gsap.utils.toArray('.reveal-section')
    gsap.set(sections, { opacity: 1, y: 0 })

    gsap.to('.float-item', {
      y: -12,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      stagger: 0.25,
      ease: 'sine.inOut',
    })

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  useEffect(() => {
    const onMove = (e) => setMouseGlow({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const categories = ['All', ...new Set(activities.map((a) => a.category))]

  const filteredActivities = useMemo(
    () =>
      activities.filter((item) => {
        const categoryOk = category === 'All' || item.category === category
        const queryOk =
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.benefits.toLowerCase().includes(query.toLowerCase())
        return categoryOk && queryOk
      }),
    [category, query],
  )

  return (
    <div className="relative overflow-hidden bg-[#FFF9F2] text-[#1E1E1E] dark:bg-[#111111] dark:text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        style={{
          background: `radial-gradient(350px at ${mouseGlow.x}px ${mouseGlow.y}px, rgba(244,163,0,.16), transparent 65%)`,
        }}
      />

      <div className="fixed left-0 top-0 z-[60] h-1 bg-gradient-to-r from-[#F4A300] via-[#ffc85b] to-[#f59d00]" style={{ width: `${progress}%` }} />

      <header className="sticky top-3 z-50 mx-auto mt-3 w-[95%] max-w-6xl rounded-2xl border border-white/40 bg-white/65 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1b1b1bcc]">
        <div className="flex items-center justify-between">
          <a href="#home" className="inline-flex items-center rounded-xl bg-white/60 px-2 py-1 dark:bg-white/10">
            <img loading="lazy" src="/spacece-logo.png" alt="SpacECE logo" className="h-14 w-14 rounded-full object-cover p-1" />
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setActiveNav(item)}
                className={`group relative text-sm font-medium transition-colors ${activeNav === item ? 'text-[#1E1E1E] dark:text-white' : 'text-[#666666] dark:text-gray-300'}`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#F4A300] transition-all duration-300 ${activeNav === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" className="rounded-full px-4 py-2 text-sm font-medium text-[#1E1E1E] dark:text-white">
              Login
            </button>
            <CTAButton href="#activities">Start Learning</CTAButton>
          </div>
          <button type="button" className="lg:hidden" onClick={() => setMobileMenu((s) => !s)}>
            {mobileMenu ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 grid gap-2 overflow-hidden lg:hidden"
            >
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="rounded-xl px-3 py-2 text-sm text-[#1E1E1E] hover:bg-[#f7efe3] dark:text-white dark:hover:bg-white/10">
                  {item}
                </a>
              ))}
              <CTAButton href="#activities">Start Learning</CTAButton>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <nav className="mx-auto mt-3 grid w-[95%] max-w-6xl grid-cols-5 rounded-2xl border border-white/50 bg-white/85 px-2 py-2 shadow-sm backdrop-blur lg:hidden">
        {['Home', 'About', 'Activities', 'Progress', 'Pricing'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="rounded-xl px-2 py-2 text-center text-xs font-semibold text-[#1E1E1E]">
            {item}
          </a>
        ))}
      </nav>

      <main className="relative z-10">
        <section id="home" className="reveal-section mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 md:grid-cols-2 md:pt-20">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-4 inline-flex rounded-full border border-[#F4A300]/40 bg-[#fff3dc] px-4 py-1 text-xs font-semibold uppercase tracking-wide">
              Premium Parental Toddler Program
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Turn Everyday Moments Into Lifelong Learning
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#666666] dark:text-gray-300">
              SpacECE helps parents transform ordinary home moments into meaningful toddler learning rituals through short, guided, science-backed activities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="#activities">Start Your Journey</CTAButton>
              <CTAButton href="#activities" outline icon={false}>Explore Activities</CTAButton>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ['2500+', 'Families'],
                ['156', 'Activities'],
                ['98%', 'Success Rate'],
              ].map((item) => (
                <div key={item[1]} className="float-item rounded-2xl border border-white/60 bg-white/70 p-3 text-center shadow-md backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <p className="font-heading text-xl font-bold text-[#F4A300] md:text-2xl">{item[0]}</p>
                  <p className="text-xs text-[#666666] dark:text-gray-300">{item[1]}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#F4A300]/30 blur-2xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-[#8CBF9F]/30 blur-2xl" />
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="hero-swiper h-[480px] rounded-[2rem]"
            >
              {['/images/hero-family.jpeg', '/images/about-learning.jpeg', '/images/activity-play.png', '/images/child.jpg'].map((src, idx) => (
                <SwiperSlide key={src} className="h-full">
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
                    <img loading="lazy" src={src} alt={`slide-${idx}`} className="h-full w-full object-cover" />
                    <div className="absolute left-4 top-4 hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm shadow-xl backdrop-blur lg:block">
                      +12 Milestones this month
                    </div>
                    <div className="absolute right-4 bottom-6 hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm shadow-xl backdrop-blur lg:block">
                      Daily guided play unlocked
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-3 flex items-center justify-center gap-2 lg:hidden">
              <div className="rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-sm">+12 Milestones this month</div>
              <div className="rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-sm">Daily guided play unlocked</div>
            </div>
          </motion.div>
        </section>

        <section id="about" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Parent Confidence"
            title="Why Parents Trust SpacECE"
            subtitle="A complete early-learning system combining emotional care with measurable progress."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trustCards.map(({ title, icon: Icon, desc }, i) => (
              <motion.div
                key={title}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow-lg backdrop-blur transition-all dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[#F4A300]/15 p-3 text-2xl text-[#1E1E1E] transition-transform group-hover:scale-110 dark:text-[#ffd584]">
                  <Icon />
                </div>
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#666666] dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="reveal-section mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
          <div className="relative">
            <img
              loading="lazy"
              src="/images/about-learning.jpeg"
              alt="Emotional parent and child connection"
              className="h-[420px] w-full rounded-[2rem] object-cover"
            />
            <div className="float-item absolute bottom-4 left-4 rounded-xl bg-white/75 p-3 text-sm shadow-lg backdrop-blur dark:bg-black/45">
              1000 days, lifelong impact
            </div>
          </div>
          <div>
            <SectionHeading
              badge="About Program"
              title="Built for the first 1000 days of brain growth"
              subtitle="Create a home ecosystem where cognitive, emotional, and social intelligence grow together."
            />
            <div className="space-y-4 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
              {[
                'Neural pathways build fastest in early years.',
                'Emotion and learning are tightly connected.',
                'Simple rituals create strong developmental habits.',
              ].map((line, i) => (
                <div key={line} className="flex items-start gap-3" data-aos="fade-up" data-aos-delay={i * 80}>
                  <IoMdCheckmarkCircleOutline className="mt-0.5 text-xl text-[#F4A300]" />
                  <p className="text-[#666666] dark:text-gray-300">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="How It Works"
            title="A four-step guided workflow"
            subtitle="From setup to measurable growth, your next action is always clear."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div key={step} whileHover={{ scale: 1.02 }} className="relative rounded-3xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F4A300] font-bold text-[#1E1E1E]">
                  {index + 1}
                </span>
                <h3 className="font-heading text-lg font-bold">{step}</h3>
                {index < steps.length - 1 && (
                  <span className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-gradient-to-r from-[#F4A300] to-transparent lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Learning Domains"
            title="Interactive growth domains"
            subtitle="Balanced development with playful, intentional progression."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {domains.map(({ title, desc, icon: Icon }) => (
              <motion.div
                key={title}
                whileHover={{ rotateX: 3, rotateY: -3, y: -8 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="group relative overflow-hidden rounded-3xl border border-[#F4A300]/20 bg-gradient-to-br from-white to-[#fff6e8] p-6 shadow-lg dark:from-[#1a1a1a] dark:to-[#131313]"
              >
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#F4A300]/20 blur-xl transition-transform group-hover:rotate-45" />
                <Icon className="mb-4 text-3xl text-[#F4A300]" />
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-[#666666] dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="activities" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Featured Activities"
            title="Premium activity library"
            subtitle="Search, filter, and explore guided activities designed for real homes and real schedules."
          />
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? 'bg-[#1E1E1E] text-white' : 'bg-white/70 text-[#1E1E1E]'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#1E1E1E]/15 bg-white/70 px-4 py-2">
              <FiSearch className="text-[#666666]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activities"
                className="w-full bg-transparent text-sm outline-none md:w-60"
              />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {filteredActivities.map((activity, index) => (
              <motion.button
                key={activity.id}
                type="button"
                onClick={() => setSelectedActivity(activity)}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-3xl border border-white/50 bg-white/75 text-left shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="bg-[#f8f4ed] p-3">
                  <img
                    loading="lazy"
                    src={activity.image}
                    alt={activity.title}
                    className={`w-full rounded-2xl object-contain transition-transform duration-500 group-hover:scale-[1.02] ${
                      index === 2 ? 'h-[30rem] md:h-[34rem]' : 'h-80 md:h-[22rem]'
                    }`}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[#F4A300]/15 px-2 py-1">{activity.duration}</span>
                    <span className="rounded-full bg-[#8CBF9F]/20 px-2 py-1">{activity.age}</span>
                    <span className="rounded-full bg-[#1E1E1E]/10 px-2 py-1">{activity.difficulty}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold">{activity.title}</h3>
                  <p className="mt-2 text-sm text-[#666666] dark:text-gray-300">{activity.benefits}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-[#666666]">Materials: {activity.materials}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="progress" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Development Tracker"
            title="Milestones you can see and celebrate"
            subtitle="Track speech, emotional growth, cognitive development, and routine consistency in one dashboard."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/50 bg-white/75 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 lg:col-span-2">
              {[
                ['Speech Tracking', 84],
                ['Emotional Growth', 76],
                ['Cognitive Development', 88],
              ].map(([label, value]) => (
                <div key={label} className="mb-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f1e6d2] dark:bg-white/10">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-[#F4A300] to-[#8CBF9F]" />
                  </div>
                </div>
              ))}
              <div className="mt-4 rounded-2xl bg-[#fff3de] p-4 text-sm dark:bg-[#201b12]">
                Monthly Timeline: 14 completed activities, 4 new milestones, 9-day consistency streak.
              </div>
            </div>
            <div className="rounded-3xl border border-white/50 bg-white/75 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="mx-auto mb-5 grid h-36 w-36 place-items-center rounded-full" style={{ background: 'conic-gradient(#F4A300 0 78%, #f2eadf 78% 100%)' }}>
                <div className="grid h-24 w-24 place-items-center rounded-full bg-[#FFF9F2] text-2xl font-bold dark:bg-[#151515]">78%</div>
              </div>
              <p className="text-center text-sm text-[#666666] dark:text-gray-300">Overall learning health</p>
              <div className="mt-5 grid gap-2 text-sm">
                {['First Words', 'Color Recognition', 'Independent Eating', 'Social Interaction'].map((badge) => (
                  <div key={badge} className="rounded-xl bg-[#f7eee0] px-3 py-2 dark:bg-white/10">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Parent Dashboard"
            title="Modern SaaS-style parenting cockpit"
            subtitle="Daily suggestions, streaks, reminders, and child-wise weekly summaries in one place."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Daily Suggestions', FiBook],
              ['Progress Reports', HiOutlineChartBar],
              ['Streak System', RiCalendarCheckLine],
              ['Saved Activities', RiPlantLine],
              ['Reminders', RiNotification2Line],
              ['Child Profiles', RiParentLine],
              ['Weekly Summaries', RiBrainLine],
              ['Mood Tracking', HiOutlineHeart],
            ].map(([label, Icon]) => (
              <motion.div key={label} whileHover={{ y: -5 }} className="rounded-2xl border border-white/50 bg-white/75 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Icon className="mb-3 text-2xl text-[#F4A300]" />
                <p className="font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Parent Stories"
            title="Trusted by growth-focused families"
            subtitle="Real stories from parents seeing meaningful change at home."
          />
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 2800 }} pagination={{ clickable: true }} spaceBetween={18} slidesPerView={1} breakpoints={{ 900: { slidesPerView: 2 } }}>
            {testimonials.map((item) => (
              <SwiperSlide key={item.name}>
                <div className="h-full rounded-3xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex items-center gap-3">
                    <img loading="lazy" src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-[#666666] dark:text-gray-300">{item.age}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-[#666666] dark:text-gray-300">{item.quote}</p>
                  <div className="flex text-[#F4A300]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Community"
            title="Learn with a parent-first community"
            subtitle="Discussions, weekly challenges, webinars, and practical shared tips."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Parent Discussions', 1240],
              ['Weekly Challenges', 84],
              ['Expert Webinars', 32],
              ['Shared Tips', 4060],
            ].map(([label, val]) => (
              <div key={label} className="rounded-3xl border border-white/50 bg-white/75 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-[#666666] dark:text-gray-300">{label}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#F4A300]">{val}+</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Pricing"
            title="Simple plans for every family"
            subtitle="Start free, then unlock premium personalization as your child grows."
          />
          {/* Pricing cards are driven by a small tier list so the featured plan can be highlighted cleanly. */}
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { plan: 'FREE', price: '$0', cta: 'Start Free', featured: false },
              { plan: 'PREMIUM', price: '$19', cta: 'Upgrade Now', featured: true },
              { plan: 'FAMILY', price: '$29', cta: 'Upgrade Now', featured: false },
            ].map((tier) => (
              <motion.div
                key={tier.plan}
                whileHover={{ scale: 1.02 }}
                className={`rounded-3xl border p-6 shadow-xl ${tier.featured ? 'border-[#F4A300] bg-gradient-to-b from-[#fff4de] to-white dark:from-[#261d0d] dark:to-[#161616]' : 'border-white/50 bg-white/75 dark:border-white/10 dark:bg-white/5'}`}
              >
                <p className="mb-2 text-sm font-semibold text-[#666666]">{tier.plan}</p>
                <p className="font-heading text-5xl font-extrabold">{tier.price}</p>
                <p className="mt-2 text-sm text-[#666666] dark:text-gray-300">per month</p>
                <ul className="my-6 space-y-2 text-sm text-[#666666] dark:text-gray-300">
                  <li>Guided daily activities</li>
                  <li>Progress dashboard</li>
                  <li>Milestone tracking</li>
                  <li>Parent tips and support</li>
                </ul>
                <CTAButton icon={false}>{tier.cta}</CTAButton>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="reveal-section mx-auto max-w-4xl px-4 py-16">
          <SectionHeading
            badge="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you need before starting your SpacECE journey."
          />
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const open = idx === faqOpen
              return (
                <div key={item.q} className="rounded-2xl border border-white/50 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <button type="button" onClick={() => setFaqOpen(open ? -1 : idx)} className="flex w-full items-center justify-between text-left font-semibold">
                    {item.q}
                    <FiChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3 text-sm text-[#666666] dark:text-gray-300"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        <section className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            badge="Extra Premium"
            title="Future-ready tools for modern parenting"
            subtitle="AI recommendations, onboarding flows, printable worksheets, and delightful motivation loops."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['AI Activity Suggestions', RiBrainLine],
              ['Mood Tracking Interface', HiOutlineHeart],
              ['Printable Worksheet Preview', FiBook],
              ['Onboarding Screens', RiTeamLine],
            ].map(([name, Icon]) => (
              <div key={name} className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
                <Icon className="mb-3 text-2xl text-[#F4A300]" />
                <p className="font-medium">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="reveal-section mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#FFF9F2] px-5 py-6 shadow-[0_30px_80px_-40px_rgba(30,30,30,.18)] ring-1 ring-black/5 md:px-8 md:py-10">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#20656a]">
                <span className="h-px w-8 bg-[#F4A300]" />
                Get in Touch
              </p>
              <h2 className="font-heading text-4xl font-semibold tracking-tight text-[#132326] md:text-6xl">
                Contact <span className="italic text-[#20656a]">Us</span>
              </h2>
              <p className="mt-4 text-base text-[#6c7d7f] md:text-lg">
                We’d love to hear from you. Schedule a visit or send an enquiry.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                {[
                  ['Address', 'SpacECE Preschool, Dhayari, Pune, Maharashtra - 411041', FiMapPin],
                  ['Phone', '90963 05648', FiPhoneCall],
                  ['Email', 'contactus@spacece.com', FiMail],
                  ['Website', 'www.spacece.com', FiGlobe],
                  ['School Hours', 'Mon - Sat: 8:00 AM - 1:00 PM', FiClock],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="flex items-center gap-4 rounded-[1.8rem] bg-[#f6ecdb] px-5 py-4 shadow-sm ring-1 ring-black/5">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#dff0ef] text-2xl text-[#20656a]">
                      <Icon />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6c7d7f]">{label}</p>
                      <p className="mt-1 text-base font-semibold text-[#132326]">{value}</p>
                    </div>
                  </div>
                ))}

                <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-black/5">
                  <iframe
                    title="SpacECE location map"
                    src="https://maps.google.com/maps?q=Dhayari%20Pune%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="h-[300px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="rounded-[2.2rem] bg-[#f6ecdb] px-6 py-8 shadow-sm ring-1 ring-black/5 md:px-10 md:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dff0ef] text-2xl text-[#20656a] shadow-sm">
                  <RiCalendarCheckLine />
                </div>
                <div className="mt-8 text-center">
                  <h3 className="font-heading text-3xl font-semibold text-[#132326] md:text-4xl">Book a Free Visit</h3>
                  <p className="mx-auto mt-4 max-w-md text-[#6c7d7f]">
                    Talk to our team today and explore what makes SpacECE special.
                  </p>
                </div>

                <div className="mt-8 space-y-4 text-center">
                  <button type="button" className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#20656a] px-6 py-4 text-lg font-semibold text-white shadow-[0_14px_30px_-12px_rgba(32,101,106,.6)] transition-transform hover:-translate-y-0.5">
                    <RiCalendarCheckLine />
                    Book My Free Visit
                    <FiArrowRight />
                  </button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <button type="button" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0d6868] px-6 py-4 text-lg font-semibold text-white shadow-[0_14px_30px_-12px_rgba(13,104,104,.55)] transition-transform hover:-translate-y-0.5">
                      <FiPhoneCall className="text-[#ff4fa0]" />
                      Call Us
                    </button>
                    <button type="button" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f4a300] px-6 py-4 text-lg font-semibold text-white shadow-[0_14px_30px_-12px_rgba(244,163,0,.5)] transition-transform hover:-translate-y-0.5">
                      <span className="text-xl">◔</span>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/30 bg-[#f7efe3] px-4 pb-24 pt-12 dark:border-white/10 dark:bg-[#141414] lg:pb-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img loading="lazy" src="/spacece-logo.png" alt="SpacECE logo" className="h-16 w-16 rounded-full object-cover p-1" />
            <p className="mt-3 text-sm text-[#666666]">
              A premium parental toddler learning program designed for emotional, measurable growth.
            </p>
          </div>
          <div>
            <p className="font-semibold">Navigation</p>
            <div className="mt-3 grid gap-2 text-sm text-[#666666] dark:text-gray-300">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#1E1E1E] dark:hover:text-white">
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <p className="mt-3 text-sm text-[#666666] dark:text-gray-300">hello@spacece.com</p>
            <p className="text-sm text-[#666666] dark:text-gray-300">+91 98765 43210</p>
          </div>
          <div>
            <p className="font-semibold">Newsletter</p>
            <div className="mt-3 flex rounded-full border border-[#1E1E1E]/20 bg-white px-2 py-1 dark:bg-[#191919]">
              <input placeholder="Your email" className="w-full bg-transparent px-3 text-sm outline-none" />
              <button type="button" className="rounded-full bg-[#F4A300] px-4 py-2 text-xs font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-[#FFF9F2] p-6 dark:bg-[#181818]"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="font-heading text-3xl font-bold">{selectedActivity.title}</h3>
                <button type="button" onClick={() => setSelectedActivity(null)}>
                  <FiX size={24} />
                </button>
              </div>
              <p className="mb-4 text-[#666666] dark:text-gray-300">{selectedActivity.outcomes}</p>
              <div className="mb-4 rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                <p className="mb-2 font-semibold">Activity Steps</p>
                <ul className="space-y-2 text-sm text-[#666666] dark:text-gray-300">
                  {selectedActivity.steps.map((step) => (
                    <li key={step}>- {step}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                  <p className="font-semibold">Parent Tips</p>
                  <p className="mt-1 text-sm text-[#666666] dark:text-gray-300">{selectedActivity.tips}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                  <p className="font-semibold">Safety Tips</p>
                  <p className="mt-1 text-sm text-[#666666] dark:text-gray-300">{selectedActivity.safety}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
