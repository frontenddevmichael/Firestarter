import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './lib/auth';
import Nav from './components/Nav';
import DashboardShell from './components/DashboardShell';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import HowToEnter from './pages/HowToEnter/HowToEnter';
import KeyDates from './pages/KeyDates/KeyDates';
import ForParentsTeachers from './pages/ForParentsTeachers/ForParentsTeachers';
import Contact from './pages/Contact/Contact';
import EnterNow from './pages/EnterNow/EnterNow';
import NotFound from './pages/NotFound/NotFound';
import SparkPack from './pages/SparkPack/SparkPack';
import SchemaMarkup from './components/SchemaMarkup';
import CompanyHome from './pages/CompanyHome/CompanyHome';
import CompanyAbout from './pages/CompanyAbout/CompanyAbout';
import Training from './pages/Training/Training';
import Deluxe from './pages/Deluxe/Deluxe';
import Forge from './pages/Forge/Forge';
import Assessment from './pages/Assessment/Assessment';
import Musical from './pages/Musical/Musical';
import ProtectedRoute from './components/ProtectedRoute';
import Skeleton from './components/Skeleton';
import { ToastProvider } from './lib/toast';

const PrizeAuth = lazy(() => import('./pages/PrizeAuth/PrizeAuth'));
const EntrantDashboard = lazy(() => import('./pages/EntrantDashboard/EntrantDashboard'));
const JudgeDashboard = lazy(() => import('./pages/JudgeDashboard/JudgeDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function PageWrapper({ children }) {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (prefersReduced) return children;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LazyPage({ Component }) {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}><Skeleton width="100%" height="60vh" /></div>}>
      <Component />
    </Suspense>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const meta = {
  '/': { title: 'The Firestarter Method — Ignite Creative Voices', desc: 'A five-force system that turns what you have seen into what you can show. Forge, Illuminate, Enact, Regenerate, Amplify.' },
  '/about': { title: 'About — Shola Amaraibi & The Firestarter Method', desc: 'The story behind the Firestarter Method and the founder, Shola Amaraibi.' },
  '/training': { title: 'Free Training — The Firestarter Method', desc: 'Fifteen minutes. The whole Firestarter Method applied to one real life.' },
  '/deluxe': { title: 'The Firestarter Deluxe — Complete Training', desc: 'The complete method, taught in one sitting. Training and workbook included.' },
  '/forge': { title: 'The Forge Intensive — One-to-One Coaching', desc: 'Three hours, one to one. Work Force One properly with Shola Amaraibi.' },
  '/assessment': { title: 'Creative Assessment — The Firestarter Method', desc: 'Discover where you are in the five forces. A personalised creative assessment.' },
  '/musical': { title: 'Firestarter Musical — Coming Soon', desc: 'Music, theatre, and performance under the Firestarter umbrella.' },
  '/contact': { title: 'Contact — The Firestarter Method', desc: 'Get in touch with Shola Amaraibi and the Firestarter team.' },
  '/prize': { title: 'Firestarter Young Poets Prize 2026', desc: 'A poetry competition for secondary school students across Lagos State, Nigeria — Junior Poets (ages 10–13) and Senior Poets (ages 14–17).' },
  '/prize/about': { title: 'About — Firestarter Young Poets Prize 2026', desc: 'Why the prize exists, the 2026 theme, and what judges are looking for.' },
  '/prize/how-to-enter': { title: 'How to Enter — Firestarter Young Poets Prize 2026', desc: 'Three steps to submit your poem: write, reflect, perform.' },
  '/prize/enter': { title: 'Submit Your Entry — Firestarter Young Poets Prize 2026', desc: 'Enter the Firestarter Young Poets Prize 2026. Submit your poem, reflection, and performance video.' },
  '/prize/key-dates': { title: 'Key Dates — Firestarter Young Poets Prize 2026', desc: 'Competition timeline: entries close 30 September 2026.' },
  '/prize/parents-and-teachers': { title: 'Parents & Teachers — Firestarter Young Poets Prize', desc: 'Information for parents and teachers supporting young poets.' },
  '/prize/spark-pack': { title: 'Spark Pack — Firestarter Young Poets Prize', desc: 'Download the Spark Pack — everything you need to prepare your entry.' },
  '/prize/contact': { title: 'Contact — Firestarter Young Poets Prize', desc: 'Get in touch with the Firestarter Young Poets Prize team.' },
  '/prize/auth': { title: 'Sign In — Firestarter Young Poets Prize', desc: 'Sign in to the Firestarter Young Poets Prize.' },
  '/prize/dashboard': { title: 'My Entry — Firestarter Young Poets Prize', desc: 'Your Firestarter Young Poets Prize entry dashboard.', noindex: true },
  '/prize/judge': { title: 'Judge Dashboard — Firestarter Young Poets Prize', desc: 'Score and review assigned entries.', noindex: true },
  '/prize/admin': { title: 'Admin — Firestarter Young Poets Prize', desc: 'Admin panel for the Firestarter Young Poets Prize.', noindex: true },
  '/prize/reset-password': { title: 'Reset Password — Firestarter Young Poets Prize', desc: 'Reset your Firestarter Young Poets Prize password.' },
};

function PageMeta() {
  const { pathname } = useLocation();
  const setMeta = useCallback(() => {
    const m = meta[pathname];
    if (!m) return;
    document.title = m.title;
    let el = document.querySelector('meta[name="description"]');
    if (el) el.setAttribute('content', m.desc);
    el = document.querySelector('meta[property="og:title"]');
    if (el) el.setAttribute('content', m.title);
    el = document.querySelector('meta[property="og:description"]');
    if (el) el.setAttribute('content', m.desc);
    el = document.querySelector('meta[name="twitter:title"]');
    if (el) el.setAttribute('content', m.title);
    el = document.querySelector('meta[name="twitter:description"]');
    if (el) el.setAttribute('content', m.desc);
    el = document.querySelector('meta[property="og:url"]');
    if (el) el.setAttribute('content', `https://firestartermethod.com${pathname}`);
    el = document.querySelector('link[rel="canonical"]');
    if (el) el.setAttribute('href', `https://firestartermethod.com${pathname}`);
    el = document.querySelector('meta[name="robots"]');
    if (el) el.setAttribute('content', m.noindex ? 'noindex' : 'index, follow');
  }, [pathname]);
  useEffect(() => { setMeta(); }, [setMeta]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/prize/dashboard') ||
                      location.pathname.startsWith('/prize/judge') ||
                      location.pathname.startsWith('/prize/admin');

  return (
    <AuthProvider>
      <ToastProvider>
      <ScrollToTop />
      <PageMeta />
      <SchemaMarkup />
      {!isDashboard && <Nav />}
      <main id="main-content">
        <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Company pages */}
          <Route path="/" element={<PageWrapper><CompanyHome /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><CompanyAbout /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/training" element={<PageWrapper><Training /></PageWrapper>} />
          <Route path="/deluxe" element={<PageWrapper><Deluxe /></PageWrapper>} />
          <Route path="/forge" element={<PageWrapper><Forge /></PageWrapper>} />
          <Route path="/assessment" element={<PageWrapper><Assessment /></PageWrapper>} />
          <Route path="/musical" element={<PageWrapper><Musical /></PageWrapper>} />
          {/* Prize pages under /prize */}
          <Route path="/prize" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/prize/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/prize/how-to-enter" element={<PageWrapper><HowToEnter /></PageWrapper>} />
          <Route path="/prize/key-dates" element={<PageWrapper><KeyDates /></PageWrapper>} />
          <Route
            path="/prize/parents-and-teachers"
            element={<PageWrapper><ForParentsTeachers /></PageWrapper>}
          />
          <Route path="/prize/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/prize/enter" element={<PageWrapper><EnterNow /></PageWrapper>} />
          <Route path="/prize/spark-pack" element={<PageWrapper><SparkPack /></PageWrapper>} />
          {/* Auth + Dashboard pages */}
          <Route path="/prize/auth" element={<PageWrapper><LazyPage Component={PrizeAuth} /></PageWrapper>} />
          <Route path="/prize/reset-password" element={<PageWrapper><LazyPage Component={ResetPassword} /></PageWrapper>} />
          <Route path="/prize/dashboard" element={<DashboardShell><PageWrapper><ProtectedRoute requiredRole="entrant"><LazyPage Component={EntrantDashboard} /></ProtectedRoute></PageWrapper></DashboardShell>} />
          <Route path="/prize/judge" element={<DashboardShell><PageWrapper><ProtectedRoute requiredRole="judge"><LazyPage Component={JudgeDashboard} /></ProtectedRoute></PageWrapper></DashboardShell>} />
          <Route path="/prize/admin" element={<DashboardShell><PageWrapper><ProtectedRoute requiredRole="admin"><LazyPage Component={AdminDashboard} /></ProtectedRoute></PageWrapper></DashboardShell>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      </main>
      {!isDashboard && <Footer />}
      </ToastProvider>
    </AuthProvider>
  );
}
