import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import HowToEnter from './pages/HowToEnter/HowToEnter';
import KeyDates from './pages/KeyDates/KeyDates';
import ForParentsTeachers from './pages/ForParentsTeachers/ForParentsTeachers';
import Contact from './pages/Contact/Contact';

// Kept short and quiet on purpose — this is a crossfade + gentle rise
// between pages, not a signature moment in its own right. Signature
// motion lives on individual pages (SparkMark ignition, KeyDates fuse).
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

export default function App() {
  const location = useLocation();

  return (
    <>
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/how-to-enter" element={<PageWrapper><HowToEnter /></PageWrapper>} />
          <Route path="/key-dates" element={<PageWrapper><KeyDates /></PageWrapper>} />
          <Route
            path="/parents-and-teachers"
            element={<PageWrapper><ForParentsTeachers /></PageWrapper>}
          />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
