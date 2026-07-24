import { motion } from 'motion/react';
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="h-20" />

      <Gallery />

      <footer className="bg-black py-8 text-center">
        <p className="text-gray-600 text-[12px] font-meta tracking-[0.14em]">
          © 2026 Dwight Sabado. All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
};

export default Home;
