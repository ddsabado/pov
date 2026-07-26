import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useAuth } from '../context/auth';
import { cld } from '../data/photos';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';

const HSH = 'a3ae993f4c5d606782c9a5fefbb30982d039c4801860ba0971e12c385391153d';

const digest = async (str: string): Promise<string> => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const getThumb = (id: string) =>
  cld.image(id).resize(fill().width(600)).delivery(quality(auto())).delivery(format(autoFormat())).toURL();

const getFullRes = (id: string) =>
  cld.image(id).resize(scale().width(2000)).delivery(quality(auto())).delivery(format(autoFormat())).toURL();

// — Gate —
export const Gate = () => {
  const { unlock } = useAuth();
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const h = await digest(val);
    if (h === HSH) {
      unlock();
    } else {
      setErr(true);
      setTimeout(() => { setErr(false); setVal(''); setBusy(false); }, 600);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={submit} className="flex flex-col items-center gap-6">
        <input
          type="password"
          value={val}
          onChange={e => { setVal(e.target.value); setErr(false); }}
          autoFocus
          className="bg-transparent border-b text-[14px] px-2 py-1 w-48 text-center outline-none transition-colors duration-200"
          style={{
            borderColor: err ? 'rgb(239 68 68)' : 'rgb(55 65 81)',
            color: err ? 'rgb(239 68 68)' : 'white',
          }}
          placeholder="••••••••"
        />
        <button
          type="submit"
          disabled={busy || !val}
          className="font-meta text-gray-400 hover:text-white text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-30"
        >
          Enter
        </button>
      </form>
    </motion.div>
  );
};

// — Grid modal —
interface GridModalProps {
  ids: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

const GridModal = ({ ids, activeIndex, onClose, onNavigate }: GridModalProps) => {
  const [leftVis, setLeftVis] = useState(true);
  const [rightVis, setRightVis] = useState(true);

  useState(() => {
    const t1 = setTimeout(() => setLeftVis(false), 1500);
    const t2 = setTimeout(() => setRightVis(false), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  const prev = () => onNavigate((activeIndex - 1 + ids.length) % ids.length);
  const next = () => onNavigate((activeIndex + 1) % ids.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(24px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-8 text-white hover:text-gray-300 z-10">
        <XCircle className="w-8 h-8" />
      </button>

      <div className="absolute left-0 top-0 w-1/4 h-full z-10 flex items-center"
        onMouseEnter={() => setLeftVis(true)} onMouseLeave={() => setLeftVis(false)}>
        <motion.button onClick={e => { e.stopPropagation(); prev(); }}
          className="ml-8 text-white" animate={{ opacity: leftVis ? 1 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeftCircle className="w-10 h-10" />
        </motion.button>
      </div>

      <div className="absolute right-0 top-0 w-1/4 h-full z-10 flex items-center justify-end"
        onMouseEnter={() => setRightVis(true)} onMouseLeave={() => setRightVis(false)}>
        <motion.button onClick={e => { e.stopPropagation(); next(); }}
          className="mr-8 text-white" animate={{ opacity: rightVis ? 1 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronRightCircle className="w-10 h-10" />
        </motion.button>
      </div>

      <motion.div
        key={activeIndex}
        className="max-w-7xl max-h-[90vh] p-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={getFullRes(ids[activeIndex])} alt="" className="max-w-full max-h-[85vh] object-contain" />
      </motion.div>
    </motion.div>
  );
};

// — Album grid page —
interface AlbumGridProps {
  ids: string[];
  label: string;
}

export const AlbumGrid = ({ ids, label }: AlbumGridProps) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <motion.div className="min-h-screen bg-black text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="h-14" />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="font-meta text-gray-600 text-[11px] tracking-[0.2em] uppercase mb-12">{label}</p>
        <div className="grid grid-cols-3 gap-1">
          {ids.map((id, i) => (
            <div
              key={id}
              className="aspect-square overflow-hidden cursor-pointer"
              onClick={() => setModalIndex(i)}
              onMouseEnter={() => { const img = new Image(); img.src = getFullRes(id); }}
            >
              <img
                src={getThumb(id)}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover hover:opacity-80 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalIndex !== null && (
          <GridModal
            ids={ids}
            activeIndex={modalIndex}
            onClose={() => setModalIndex(null)}
            onNavigate={setModalIndex}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// — Default export: gate page at /album —
const Album = () => {
  const { unlocked } = useAuth();
  return unlocked ? (
    <motion.div className="min-h-screen bg-black flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="font-meta text-gray-600 text-[11px] tracking-[0.2em] uppercase">Select an album</p>
    </motion.div>
  ) : <Gate />;
};

export default Album;
