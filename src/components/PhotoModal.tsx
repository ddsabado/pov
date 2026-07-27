import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { getFullRes } from '../data/photos';

interface PhotoModalProps {
  ids: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoModal = ({ ids, activeIndex, onClose, onNavigate }: PhotoModalProps) => {
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const leftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade out arrows shortly after modal opens
  useEffect(() => {
    leftTimer.current = setTimeout(() => setLeftVisible(false), 1500);
    rightTimer.current = setTimeout(() => setRightVisible(false), 1500);
    return () => {
      if (leftTimer.current) clearTimeout(leftTimer.current);
      if (rightTimer.current) clearTimeout(rightTimer.current);
    };
  }, []);

  const showLeft = () => { if (leftTimer.current) clearTimeout(leftTimer.current); setLeftVisible(true); };
  const hideLeft = () => { leftTimer.current = setTimeout(() => setLeftVisible(false), 400); };
  const showRight = () => { if (rightTimer.current) clearTimeout(rightTimer.current); setRightVisible(true); };
  const hideRight = () => { rightTimer.current = setTimeout(() => setRightVisible(false), 400); };

  const prev = useCallback(() => onNavigate((activeIndex - 1 + ids.length) % ids.length), [activeIndex, ids, onNavigate]);
  const next = useCallback(() => onNavigate((activeIndex + 1) % ids.length), [activeIndex, ids, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(24px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-6 right-8 text-white hover:text-gray-300 transition-colors duration-[200ms] z-10" aria-label="Close">
          <XCircle className="w-8 h-8" />
        </button>

        <div className="absolute left-0 top-0 w-1/4 h-full z-10 flex items-center" onMouseEnter={showLeft} onMouseLeave={hideLeft}>
          <motion.button onClick={e => { e.stopPropagation(); prev(); }} className="ml-8 text-white" aria-label="Previous"
            animate={{ opacity: leftVisible ? 1 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
            <ChevronLeftCircle className="w-10 h-10" />
          </motion.button>
        </div>

        <div className="absolute right-0 top-0 w-1/4 h-full z-10 flex items-center justify-end" onMouseEnter={showRight} onMouseLeave={hideRight}>
          <motion.button onClick={e => { e.stopPropagation(); next(); }} className="mr-8 text-white" aria-label="Next"
            animate={{ opacity: rightVisible ? 1 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
            <ChevronRightCircle className="w-10 h-10" />
          </motion.button>
        </div>

        <motion.div
          key={activeIndex}
          className="max-w-7xl max-h-[90vh] p-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
        >
          <img
            src={getFullRes(ids[activeIndex]).toURL()}
            alt=""
            className="max-w-full max-h-[85vh] object-contain"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoModal;
