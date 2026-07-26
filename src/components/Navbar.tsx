import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/auth';

const tabs = [
  { label: 'Scroll Gallery', path: '/gallery' },
  { label: 'Gear', path: '/gear' },
  { label: 'About', path: '/about' },
];

const travelItems = [
  { label: "MIN '24", path: '/album/min24' },
];

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [travelOpen, setTravelOpen] = useState(false);
  const lastScrollY = useRef(0);
  const travelRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { unlocked } = useAuth();

  const selectedTab = tabs.findIndex(t => location.pathname === t.path);
  const isTravelActive = location.pathname.startsWith('/album');

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) setVisible(true);
      else if (currentY > lastScrollY.current) setVisible(false);
      else setVisible(true);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travelRef.current && !travelRef.current.contains(e.target as Node)) {
        setTravelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleTabClick = (tab: typeof tabs[number]) => {
    if (tab.path === '/gallery' && location.pathname === '/gallery') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(tab.path);
    }
  };

  return (
    <motion.nav
      className="bg-black text-white fixed w-full z-50 border-b border-gray-800"
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <motion.span
            layoutId="ddwump"
            onClick={() => navigate('/')}
            className="font-bold text-2xl tracking-tight cursor-pointer hover:text-gray-300 transition-colors duration-[200ms]"
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            DDWUMP
          </motion.span>

          <ul className="flex items-center gap-1" role="tablist">
            {tabs.map((tab, i) => {
              const isSelected = selectedTab === i;
              return (
                <li key={tab.path} role="none">
                  <motion.button
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleTabClick(tab)}
                    whileTap={{ scale: 0.95 }}
                    whileFocus={{ scale: 1.05 }}
                    className="relative px-3 py-1.5 text-[14px] font-light rounded-full outline-none cursor-pointer"
                    style={{ color: isSelected ? '#fff' : '#9ca3af' }}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-md bg-white/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 transition-colors duration-200">{tab.label}</span>
                  </motion.button>
                </li>
              );
            })}

            {/* Travel dropdown — only when unlocked */}
            {unlocked && (
              <li ref={travelRef} className="relative" role="none">
                <motion.button
                  onClick={() => setTravelOpen(o => !o)}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-3 py-1.5 text-[14px] font-light rounded-full outline-none cursor-pointer"
                  style={{ color: isTravelActive ? '#fff' : '#9ca3af' }}
                >
                  {isTravelActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-white/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Album</span>
                </motion.button>

                {/* Dropdown */}
                {travelOpen && (
                  <motion.ul
                    className="absolute right-0 top-full mt-1 bg-black border border-gray-800 rounded-md py-1 min-w-[120px] z-50"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {travelItems.map(item => (
                      <li key={item.path}>
                        <button
                          onClick={() => { navigate(item.path); setTravelOpen(false); }}
                          className="w-full text-left px-4 py-2 text-[13px] font-meta text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
