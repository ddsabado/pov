import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PhotoModalProps {
  photo: {
    thumbnailUrl: string;
    position: { left: number; top: number; width: number; height: number };
    naturalWidth: number;
    naturalHeight: number;
  };
  isClosing: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}

const PhotoModal = ({ photo, isClosing, onClose, onExitComplete }: PhotoModalProps) => {
  const reduceMotion = useReducedMotion();
  const geometry = useMemo(() => {
    const maxWidth = window.innerWidth * 0.92;
    const maxHeight = window.innerHeight * 0.85;
    const aspectRatio = photo.naturalWidth / photo.naturalHeight;
    const width = Math.min(maxWidth, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    return {
      left,
      top,
      width,
      height,
      x: photo.position.left + photo.position.width / 2 - (left + width / 2),
      y: photo.position.top + photo.position.height / 2 - (top + height / 2),
      scaleX: photo.position.width / width,
      scaleY: photo.position.height / height,
    };
  }, [photo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <motion.div
        className="absolute cursor-zoom-out overflow-hidden"
        style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height, transformOrigin: 'center center' }}
        initial={{ x: geometry.x, y: geometry.y, scaleX: geometry.scaleX, scaleY: geometry.scaleY }}
        animate={isClosing
          ? { x: geometry.x, y: geometry.y, scaleX: geometry.scaleX, scaleY: geometry.scaleY }
          : { x: 0, y: 0, scaleX: 1, scaleY: 1 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.2, 0.75, 0.25, 1] }}
        onAnimationComplete={() => {
          if (isClosing) onExitComplete();
        }}
        onClick={event => {
          event.stopPropagation();
          onClose();
        }}
      >
        <img
          src={photo.thumbnailUrl}
        alt=""
        decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default PhotoModal;
