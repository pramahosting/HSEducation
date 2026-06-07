import { useState, useEffect } from 'react';
import GlobalStyles from './components/GlobalStyles';
import Nav from './components/Nav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ImpactPage from './pages/ImpactPage';
import DonatePage from './pages/DonatePage';
import LegalPage from './pages/LegalPage';

export default function App() {
  const [page, setPage] = useState('Home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const pages = {
    Home:     <HomePage    setPage={setPage} />,
    About:    <AboutPage   setPage={setPage} />,
    Projects: <ProjectsPage setPage={setPage} />,
    Impact:   <ImpactPage />,
    Donate:   <DonatePage />,
    Legal:    <LegalPage />,
  };

  return (
    <>
      <GlobalStyles />
      <Nav page={page} setPage={setPage} />
      <main>{pages[page]}</main>
      <Footer setPage={setPage} />
    </>
  );
}
