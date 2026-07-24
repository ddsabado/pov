import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gearX100V from '../assets/gear-x100v.webp';
import gearIxus from '../assets/gear-ixus.webp';
import gearOsmo from '../assets/gear-osmo.webp';
import gearGodox from '../assets/gear-godox.jpg';
import gearUlanzi from '../assets/gear-ulanzi.webp';
import gearMa02 from '../assets/gear-ma02.jpg';

interface GearItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  specs: string[];
  image: string;
}

const gears: GearItem[] = [
  { id: 'x100v',  name: 'Fujifilm X100V',      subtitle: 'Fixed Lens Compact', description: 'The camera I carry everywhere. The X100V is a fixed 23mm f/2 lens camera that forces you to think about composition rather than reaching for zoom. Its film simulations — especially Classic Neg and Eterna Cinema — give images a tactile, analog feel straight out of camera.', specs: ['23mm f/2 fixed lens', '26.1MP X-Trans CMOS 4', 'Classic Neg / Eterna', 'Weather resistant'], image: gearX100V },
  { id: 'ixus',   name: 'Canon IXUS 115 HS',   subtitle: 'Point & Shoot',       description: 'A compact point-and-shoot that fits in any pocket. The IXUS 115 HS brings a lo-fi, casual energy to shooting. Sometimes the best camera is the one that disappears into the moment.', specs: ['28mm wide-angle', '12.1MP CMOS', 'Smart IS stabilization', 'Pocket-sized'], image: gearIxus },
  { id: 'osmo',   name: 'DJI Osmo Action 6',   subtitle: 'Action Camera',       description: "Built for moments that move. The Osmo Action 6 handles the shots that other cameras can't — water, dust, fast motion. RockSteady stabilization makes handheld footage feel cinematic even in rough conditions.", specs: ['4K 120fps', 'RockSteady 3.0+', 'Horizon steady', 'Waterproof 20m'], image: gearOsmo },
  { id: 'godox',  name: 'Godox iT30 Pro',       subtitle: 'Portable Flash',      description: 'A compact TTL flash that punches above its size. The iT30 Pro fills shadows and adds dimension in low-light environments without overwhelming the natural atmosphere of a scene.', specs: ['30Ws output', 'TTL / Manual', '2.4G wireless', 'USB-C charging'], image: gearGodox },
  { id: 'ulanzi', name: 'Ulanzi MT-80',           subtitle: 'Travel Tripod',       description: 'A 7-foot aluminum tripod that auto-opens with one pull. The MT-80 goes from bag to fully deployed in seconds — useful for self-portraits, long exposures, and anywhere you need a stable platform without the bulk.', specs: ['7ft / 213cm max height', '11 lb load capacity', '360° ball head', '1/4"-20 mount'], image: gearUlanzi },
  { id: 'ma02',   name: 'Godox MA02',             subtitle: 'Magnetic Filter Kit', description: 'A magnetic accessory kit for the iT30 Pro. Snap on CTO, CTB, or creative color gels in one touch to shift the mood of a scene without slowing down. The diffuser softens harsh flash output for close-up work.', specs: ['Magnetic snap-on system', 'CTO / CTB correction gels', 'Creative color filters', 'Diffuser included'], image: gearMa02 },
];

const RADIUS = 280;
const ITEM_SIZE = 180;
// 6 items × 60° = full circle. Active position = 0° (3 o'clock).
const BASE_ANGLES = [0, 60, 120, 180, 240, 300];

export default function Gear() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  // Continuous rotation so spring animates without wrap jumps
  const [rotation, setRotation] = useState(0);
  const scrollLock = useRef(false);
  const wheelAccum = useRef(0);

  const cycle = useCallback((dir: 1 | -1) => {
    if (scrollLock.current) return;
    scrollLock.current = true;
    setDirection(dir);
    setActiveIndex(i => (i + dir + gears.length) % gears.length);
    setRotation(r => r - dir * 60); // 60° per step for 6 items
    setTimeout(() => { scrollLock.current = false; wheelAccum.current = 0; }, 700);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) >= 50) {
        cycle(wheelAccum.current > 0 ? 1 : -1);
        wheelAccum.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') cycle(1);
      if (e.key === 'ArrowUp') cycle(-1);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [cycle]);

  const active = gears[activeIndex];

  const textVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: (dir: number) => ({ y: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
  };

  // Responsive radius — use window dimensions to detect landscape mobile
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const isDesktop = vw >= 768;
  const isLandscapeMobile = !isDesktop && vw > vh;
  const r = isDesktop ? RADIUS : isLandscapeMobile ? 120 : 160;
  const itemSize = isDesktop ? ITEM_SIZE : isLandscapeMobile ? 60 : 80;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="h-14" />

      {/* Portrait: stacked. Landscape / desktop: side by side */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">

        {/* Dial — takes less space on mobile */}
        <div className="relative flex-shrink-0 md:w-[340px] w-full md:h-full h-1/2" >

          {/* Circle outlines */}
          <svg
            className="absolute pointer-events-none"
            style={{ left: -r, top: '50%', marginTop: -r, width: r*2, height: r*2, overflow: 'visible' }}
          >
            <circle cx={r} cy={r} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle cx={r} cy={r} r={r * 0.65} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
          </svg>

          {/* Rotating wheel */}
          <motion.div
            className="absolute"
            style={{ width: r*2, height: r*2, left: -r, top: '50%', marginTop: -r }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 160, damping: 28, mass: 1 }}
          >
            {gears.map((gear, i) => {
              const angleDeg = BASE_ANGLES[i];
              const angleRad = (angleDeg * Math.PI) / 180;
              const cx = r + r * Math.cos(angleRad) - itemSize / 2;
              const cy = r + r * Math.sin(angleRad) - itemSize / 2;
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={gear.id}
                  className="absolute cursor-pointer flex items-center justify-center"
                  style={{ width: itemSize, height: itemSize, left: cx, top: cy, zIndex: 1 }}
                  onClick={() => !isActive && cycle(((i - activeIndex + gears.length) % gears.length === 1 ? 1 : -1) as 1 | -1)}
                >
                  <motion.img
                    src={gear.image}
                    alt={gear.name}
                    className="w-full h-full object-contain"
                    animate={{ rotate: -rotation, opacity: 1, scale: isActive ? 1.1 : 0.75 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 28, mass: 1 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Gear details */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 overflow-y-auto md:overflow-visible md:max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={active.id} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit">
              <h1 className="text-[18px] md:text-[42px] font-bold leading-[1.05] tracking-tight mb-1 md:mb-2">{active.name}</h1>
              <p className="font-meta text-gray-500 text-[10px] md:text-[13px] tracking-[0.15em] uppercase mb-2 md:mb-8">{active.subtitle}</p>
              <p className="text-gray-300 text-[11px] md:text-[16px] leading-[1.5] md:leading-[1.75] font-light mb-3 md:mb-10 max-w-lg">{active.description}</p>
              <ul className="flex flex-col gap-1 md:gap-2">
                {active.specs.map(spec => (
                  <li key={spec} className="flex items-center gap-2 text-[10px] md:text-[13px] text-gray-400 font-meta">
                    <span className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
