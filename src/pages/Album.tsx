import { useState } from 'react';
import { motion } from 'motion/react';

const HSH = 'a3ae993f4c5d606782c9a5fefbb30982d039c4801860ba0971e12c385391153d';
const SK = 'alb_s';

const digest = async (str: string): Promise<string> => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const Gate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const h = await digest(val);
    if (h === HSH) {
      sessionStorage.setItem(SK, '1');
      onUnlock();
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

const AlbumContent = () => (
  <motion.div
    className="min-h-screen bg-black text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="h-14" />
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-meta text-gray-600 text-[11px] tracking-[0.2em] uppercase mb-12">Album</p>
      <img
        src="https://res.cloudinary.com/b9wkiwrj/image/upload/w_1200,q_auto,f_auto/DSCF6711_avzxt9"
        alt="test"
        className="w-full"
      />
    </div>
  </motion.div>
);

const Album = () => {
  const [ok, setOk] = useState(() => sessionStorage.getItem(SK) === '1');
  return ok ? <AlbumContent /> : <Gate onUnlock={() => setOk(true)} />;
};

export default Album;
