import { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getFullRes } from '../data/photos';

interface AlbumPhotoModalProps {
  ids: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const AlbumPhotoModal = ({ ids, activeIndex, onClose, onNavigate }: AlbumPhotoModalProps) => {
  const previous = useCallback(() => {
    onNavigate((activeIndex - 1 + ids.length) % ids.length);
  }, [activeIndex, ids.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate((activeIndex + 1) % ids.length);
  }, [activeIndex, ids.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
      }
    };
    const preventScroll = (event: Event) => event.preventDefault();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [next, onClose, previous]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Album photo viewer"
    >
      <motion.button
        type="button"
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 z-10 p-2 text-white/70 transition-colors hover:text-white sm:right-6 sm:top-6"
        whileTap={{ scale: 0.92 }}
        onClick={event => {
          event.stopPropagation();
          onClose();
        }}
      >
        <X className="size-5" strokeWidth={1.5} />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Previous photo"
        className="absolute left-2 z-10 p-3 text-white/70 transition-colors hover:text-white sm:left-6"
        whileTap={{ scale: 0.92 }}
        onClick={event => {
          event.stopPropagation();
          previous();
        }}
      >
        <ChevronLeft className="size-6 sm:size-8" strokeWidth={1.5} />
      </motion.button>

      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={ids[activeIndex]}
          src={getFullRes(ids[activeIndex]).toURL()}
          alt=""
          decoding="async"
          className="max-h-[86vh] max-w-[calc(100vw-6rem)] object-contain sm:max-w-[calc(100vw-10rem)]"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={event => event.stopPropagation()}
        />
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Next photo"
        className="absolute right-2 z-10 p-3 text-white/70 transition-colors hover:text-white sm:right-6"
        whileTap={{ scale: 0.92 }}
        onClick={event => {
          event.stopPropagation();
          next();
        }}
      >
        <ChevronRight className="size-6 sm:size-8" strokeWidth={1.5} />
      </motion.button>
    </motion.div>
  );
};

export default AlbumPhotoModal;
