import { useState } from 'react';
import { motion, AnimatePresence, stagger } from 'motion/react';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { photoGroups, getThumbnail, getFullRes, Photo } from '../data/photos';
import PhotoModal from './PhotoModal';

// Parent group — triggers stagger when it enters viewport
const groupVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.12),
    },
  },
};

// Individual photo card
const photoVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16,
      mass: 1,
    },
  },
};

const PhotoCard = ({
  photo,
  onClick,
  onMouseEnter,
}: {
  photo: Photo;
  onClick: () => void;
  onMouseEnter: () => void;
}) => (
  <motion.div
    variants={photoVariants}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className="cursor-pointer overflow-hidden w-full h-full"
    whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
  >
    <AdvancedImage
      cldImg={getThumbnail(photo.publicId)}
      plugins={[lazyload(), placeholder({ mode: 'blur' })]}
      alt={photo.publicId.split('_')[0]}
      className="w-full h-full object-cover"
    />
  </motion.div>
);

const Gallery = () => {
  const allPhotos = photoGroups.flatMap(g => g.photos);
  const allIds = allPhotos.map(p => p.publicId);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const prefetchFullRes = (publicId: string) => {
    const img = new Image();
    img.src = getFullRes(publicId).toURL();
  };

  const openPhoto = (photo: Photo) => setActiveIndex(allIds.indexOf(photo.publicId));

  const card = (photo: Photo) => (
    <PhotoCard
      key={photo.id}
      photo={photo}
      onClick={() => openPhoto(photo)}
      onMouseEnter={() => prefetchFullRes(photo.publicId)}
    />
  );

  const renderGroup = (group: typeof photoGroups[number], groupIndex: number) => {
    const { photos } = group;
    const leftOffset = groupIndex % 2 === 0 ? '' : 'mt-16';
    const rightOffset = groupIndex % 2 === 0 ? 'mt-16' : '';

    // staggered: each photo alternates left/right margin, stacked vertically
    if (group.layout === 'staggered') {
      return (
        <div className="flex flex-col gap-4">
          {photos.map((photo, i) => (
            <div key={photo.id} className={`w-3/5 ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
              {card(photo)}
            </div>
          ))}
        </div>
      );
    }

    // row: all photos in a single horizontal line, same aspect ratio (default portrait 2:3)
    if (group.layout === 'row') {
      const aspect = group.rowAspect ?? '2/3';
      return (
        <div className="flex gap-4 items-start">
          {photos.map(photo => (
            <div key={photo.id} className="flex-1 overflow-hidden" style={{ aspectRatio: aspect }}>
              {card(photo)}
            </div>
          ))}
        </div>
      );
    }

    // centered-stack: all photos centered at same reduced width, stacked
    if (group.layout === 'centered-stack') {
      return (
        <div className="flex flex-col gap-4 items-center">
          {photos.map(photo => (
            <div key={photo.id} className="w-3/4">
              {card(photo)}
            </div>
          ))}
        </div>
      );
    }

    // centered-cascade: photos stacked center, each smaller than the one above
    if (group.layout === 'centered-cascade') {
      const widths = ['w-3/4', 'w-1/2', 'w-1/3'];
      return (
        <div className="flex flex-col gap-4 items-center">
          {photos.map((photo, i) => (
            <div key={photo.id} className={widths[i] ?? 'w-1/3'}>
              {card(photo)}
            </div>
          ))}
        </div>
      );
    }

    // triangle-up: apex top-center, two on bottom row
    if (group.layout === 'triangle-up' && photos.length === 3) {
      const [bottomLeft, bottomRight, apex] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="w-3/4">{card(apex)}</div>
          </div>
          <div className="flex gap-4 justify-center">
            <div className="w-[40%]">{card(bottomLeft)}</div>
            <div className="w-[40%]">{card(bottomRight)}</div>
          </div>
        </div>
      );
    }

    // top-center-then-staggered: [0] small centered top, rest staggered left/right
    if (group.layout === 'top-center-then-staggered') {
      const [top, ...rest] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="w-2/5">{card(top)}</div>
          </div>
          <div className="flex flex-col gap-4">
            {rest.map((photo, i) => (
              <div key={photo.id} className={`w-4/5 ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                {card(photo)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // cascade-align-3: [0] left, [1] center, [2] right — no full-width top
    if (group.layout === 'cascade-align-3' && photos.length === 3) {
      const [left, center, right] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="w-2/5 mr-auto">{card(left)}</div>
          <div className="w-2/5 mx-auto">{card(center)}</div>
          <div className="w-2/5 ml-auto">{card(right)}</div>
        </div>
      );
    }

    // cascade-align: [0] full width, [1] left, [2] center, [3] right
    if (group.layout === 'cascade-align' && photos.length === 4) {
      const [full, left, center, right] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="w-full">{card(full)}</div>
          <div className="w-2/5 mr-auto">{card(left)}</div>
          <div className="w-2/5 mx-auto">{card(center)}</div>
          <div className="w-2/5 ml-auto">{card(right)}</div>
        </div>
      );
    }

    // triangle-inverted-tail: [0][1] top row, [2] vertex center, [3] tail center below
    if (group.layout === 'triangle-inverted-tail' && photos.length === 4) {
      const [topLeft, topRight, vertex, tail] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <div className="w-[40%]">{card(topLeft)}</div>
            <div className="w-[40%]">{card(topRight)}</div>
          </div>
          <div className="flex justify-center">
            <div className="w-3/4">{card(vertex)}</div>
          </div>
          <div className="flex justify-center">
            <div className="w-2/3">{card(tail)}</div>
          </div>
        </div>
      );
    }

    // triangle-right: [0] top-left, [1] bottom-left, [2] right vertex
    if (group.layout === 'triangle-right' && photos.length === 3) {
      const [topLeft, bottomLeft, vertex] = photos;
      return (
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-4 w-[55%]">
            {card(topLeft)}
            {card(bottomLeft)}
          </div>
          <div className="w-[45%]">{card(vertex)}</div>
        </div>
      );
    }

    // triangle-left: vertex (photos[2]) on left, photos[0] and photos[1] stacked on right
    if (group.layout === 'triangle-left' && photos.length === 3) {
      const [top, bottom, vertex] = photos;
      return (
        <div className="flex gap-4 items-center">
          <div className="w-1/2">{card(vertex)}</div>
          <div className="flex flex-col gap-4 flex-1">
            {card(top)}
            {card(bottom)}
          </div>
        </div>
      );
    }

    // triangle-down: photos[2] top-center, photos[0] bottom-left, photos[1] bottom-right
    if (group.layout === 'triangle-down' && photos.length === 3) {
      const [bottomLeft, bottomRight, apex] = photos;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="w-2/3">{card(apex)}</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-3/5">{card(bottomLeft)}</div>
            <div className="flex-1">{card(bottomRight)}</div>
          </div>
        </div>
      );
    }

    const portraitPhotos = photos.filter(p => !p.landscape);
    const landscapePhotos = photos.filter(p => p.landscape);

    const portraitBlock = () => {
      if (portraitPhotos.length === 0) return null;

      // inverted triangle: two on top, one centered below
      if (portraitPhotos.length === 3) {
        return (
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <div className="flex-1">{card(portraitPhotos[0])}</div>
              <div className="flex-1">{card(portraitPhotos[1])}</div>
            </div>
            <div className="flex justify-center">
              <div className="w-1/2">{card(portraitPhotos[2])}</div>
            </div>
          </div>
        );
      }

      // default: staggered two-column
      const left = portraitPhotos.filter((_, i) => i % 2 === 0);
      const right = portraitPhotos.filter((_, i) => i % 2 === 1);
      return (
        <div className="flex gap-4 items-start mb-4">
          <div className={`flex flex-col gap-4 flex-1 ${leftOffset}`}>
            {left.map(card)}
          </div>
          {right.length > 0 && (
            <div className={`flex flex-col gap-4 flex-1 ${rightOffset}`}>
              {right.map(card)}
            </div>
          )}
        </div>
      );
    };

    const landscapeBlock = () => {
      if (landscapePhotos.length === 0) return null;
      return (
        <div className="flex flex-col gap-4">
          {landscapePhotos.map((photo, i) => (
            <div key={photo.id} className={i % 2 === 0 ? 'mr-16' : 'ml-16'}>
              {card(photo)}
            </div>
          ))}
        </div>
      );
    };

    return (
      <>
        {portraitBlock()}
        {landscapeBlock()}
      </>
    );
  };

  return (
    <section id="gallery" className="bg-black pb-24" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {photoGroups.map((group, groupIndex) => (
          <motion.div
            key={group.name}
            className="mb-24"
            variants={groupVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, amount: 0.05 }}
          >
            {renderGroup(group, groupIndex)}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <PhotoModal
            ids={allIds}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
