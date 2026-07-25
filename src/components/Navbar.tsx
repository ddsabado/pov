import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const tabs = [
  { label: 'Scroll Gallery', path: '/gallery' },
  { label: 'Gear', path: '/gear' },
  { label: 'About', path: '/about' },
];

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedTab = tabs.findIndex(t => location.pathname === t.path);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          >
            DDWUMP
          </motion.span>

          {/* Tab select */}
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
                          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 transition-colors duration-200">
                        {tab.label}
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
