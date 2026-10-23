import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import ConsentForm from './pages/ConsentForm/ConsentForm';
import Contact from './pages/Contact/Contact';
import CompanyContact from './pages/CompanyContact/CompanyContact';
import EnterNow from './pages/EnterNow/EnterNow';
import NotFound from './pages/NotFound/NotFound';
import SparkPack from './pages/SparkPack/SparkPack';
import SchemaMarkup from './components/SchemaMarkup';
import CompanyHome from './pages/CompanyHome/CompanyHome';
import Training from './pages/Training/Training';
import WorkWithMe from './pages/WorkWithMe/WorkWithMe';

import Musical from './pages/Musical/Musical';
import ProtectedRoute from './components/ProtectedRoute';
import Skeleton from './components/Skeleton';
import { ToastProvider } from './lib/toast';
import { ROUTE_META } from './lib/routesMeta';

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
  // Read the user's motion preference before first paint instead of in an effect.
  const [prefersReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

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

const meta = ROUTE_META;

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
  const hideNav = isDashboard || location.pathname === '/briefing';

  return (
    <AuthProvider>
      <ToastProvider>
      <ScrollToTop />
      <PageMeta />
      <SchemaMarkup />
      {!hideNav && <Nav />}
      <a href="#main-content" className="skipLink">Skip to content</a>
      <main id="main-content">
        <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Company pages */}
          <Route path="/" element={<PageWrapper><CompanyHome /></PageWrapper>} />
          <Route path="/work" element={<PageWrapper><WorkWithMe /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><CompanyContact /></PageWrapper>} />
          <Route path="/briefing" element={<PageWrapper><Training /></PageWrapper>} />
          <Route path="/training" element={<Navigate to="/briefing" replace />} />

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
          <Route path="/prize/consent-form" element={<PageWrapper><ConsentForm /></PageWrapper>} />
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
