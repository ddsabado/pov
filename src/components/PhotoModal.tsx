import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { getFullRes } from '../data/photos';

interface PhotoOrigin {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PhotoModalProps {
  id: string;
  origin: PhotoOrigin;
  naturalWidth: number;
  naturalHeight: number;
  isClosing: boolean;
  onClose: () => void;
  onReturnComplete: () => void;
}

const PhotoModal = ({ id, origin, naturalWidth, naturalHeight, isClosing, onClose, onReturnComplete }: PhotoModalProps) => {
  const reduceMotion = useReducedMotion();
  const fullImageUrl = getFullRes(id).toURL();
  const transition = { duration: reduceMotion ? 0.12 : 0.3, ease: [0.2, 0.75, 0.25, 1] as const };
  const target = useMemo(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = viewportWidth * 0.92;
    const maxHeight = viewportHeight * 0.85;
    const aspectRatio = naturalWidth / naturalHeight || 1;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width,
      height,
      x: origin.x + origin.width / 2 - viewportWidth / 2,
      y: origin.y + origin.height / 2 - viewportHeight / 2,
      scaleX: origin.width / width,
      scaleY: origin.height / height,
    };
  }, [naturalHeight, naturalWidth, origin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    };
    const preventScroll = (e: Event) => e.preventDefault();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <motion.div
        className="cursor-zoom-out"
        style={{ width: target.width, height: target.height, transformOrigin: 'center center' }}
        initial={{ x: target.x, y: target.y, scaleX: target.scaleX, scaleY: target.scaleY }}
        animate={isClosing
          ? { x: target.x, y: target.y, scaleX: target.scaleX, scaleY: target.scaleY }
          : { x: 0, y: 0, scaleX: 1, scaleY: 1 }}
        transition={transition}
        onAnimationComplete={() => {
          if (isClosing) onReturnComplete();
        }}
        onClick={event => {
          event.stopPropagation();
          onClose();
        }}
      >
        <img
          src={fullImageUrl}
          alt=""
          decoding="async"
          className="block h-full w-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default PhotoModal;
