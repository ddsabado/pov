import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { useAuth } from '../context/auth';
import { cld, getFullRes } from '../data/photos';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import PhotoModal from '../components/PhotoModal';

const HSH = 'a3ae993f4c5d606782c9a5fefbb30982d039c4801860ba0971e12c385391153d';

const digest = async (str: string): Promise<string> => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const getThumb = (id: string) =>
  cld.image(id).resize(fill().width(600)).delivery(quality(auto())).delivery(format(autoFormat()));

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
              onMouseEnter={() => { const img = new Image(); img.src = getFullRes(id).toURL(); }}
            >
              <AdvancedImage
                cldImg={getThumb(id)}
                plugins={[lazyload(), placeholder({ mode: 'blur' })]}
                alt=""
                className="w-full h-full object-cover hover:opacity-80 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalIndex !== null && (
          <PhotoModal
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
