import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cld } from '../data/photos';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';

const landingPhotos = [
  'DSCF2327_syg04w',
  'DSCF6711_avzxt9',
  'DSCF2747_pfbd95',
  'DSCF1114_q4wu8y',
  'DSCF1730-2_mjuixv',
  'photo31_mxfdng',
  'photo1_pn1dmk',
  'photo18_pttdnf',
  'photo7_iae7ku',
];

const getUrl = (publicId: string) =>
  cld.image(publicId)
    .resize(scale().width(2560))
    .delivery(quality(auto()))
    .delivery(format(autoFormat()))
    .toURL();

const fisherYates = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const shuffledPhotos = fisherYates(landingPhotos);

const INTERVAL = 4000;

const Landing = () => {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();

  const enter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    navigate('/gallery');
  }, [navigate, exiting]);

  // Preload all landing images on mount
  useEffect(() => {
    shuffledPhotos.forEach(id => {
      const img = new Image();
      img.src = getUrl(id);
    });
  }, []);

  // Disable scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Cycle through photos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % shuffledPhotos.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Enter on keypress
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') enter();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enter]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background slideshow — this fades to black */}
      <motion.div
        className="absolute inset-0"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      >
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <img
              src={getUrl(shuffledPhotos[index])}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* DDWUMP — outside the fade, always visible, animates via layoutId */}
      <div className="absolute top-6 right-8 z-10">
        <motion.span
          layoutId="ddwump"
          className="font-bold text-white text-[15px] tracking-widest"
        >
          DDWUMP
        </motion.span>
      </div>

      {/* View button — bottom center */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 flex justify-center z-10"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={enter}
          className="font-medium text-white text-[13px] tracking-[0.3em] uppercase px-10 py-3 bg-transparent cursor-pointer select-none"
          style={{ border: '2px solid rgba(255,255,255,0.6)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          whileHover={{
            borderColor: 'rgba(255,255,255,1)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            scale: 1.03,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.96,
            backgroundColor: 'rgba(255,255,255,0.15)',
            transition: { duration: 0.1 },
          }}
        >
          View
        </motion.button>
      </motion.div>

      {/* Footer copyright */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-meta text-white/40 text-[11px] tracking-[0.14em]">
          © 2026 Dwight Sabado. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Landing;
