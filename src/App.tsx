import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Gear from './pages/Gear';
import About from './pages/About';
import Navbar from './components/Navbar';

const Layout = () => {
  const location = useLocation();
  const hiddenNavbar = location.pathname === '/';

  return (
    <>
      {!hiddenNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/gallery" element={<Home />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter basename="/pov-portfolio">
      <Layout />
    </BrowserRouter>
  );
};

export default App;
