import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import HowToEnter from './pages/HowToEnter/HowToEnter';
import KeyDates from './pages/KeyDates/KeyDates';
import ForParentsTeachers from './pages/ForParentsTeachers/ForParentsTeachers';
import Contact from './pages/Contact/Contact';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-to-enter" element={<HowToEnter />} />
        <Route path="/key-dates" element={<KeyDates />} />
        <Route path="/parents-and-teachers" element={<ForParentsTeachers />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
