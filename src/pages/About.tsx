import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const About = () => {
  return (
    <motion.div
      className="min-h-screen bg-black text-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="h-14" />

      <section className="flex-1 py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[28px] md:text-[34px] font-semibold leading-[1.2] mb-8 text-white">
            About
          </h2>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/ddwump/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-[200ms]"
              aria-label="Instagram"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="https://open.spotify.com/playlist/0pM0PYFwIvzM38bcFrdy31"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-[200ms]"
              aria-label="Spotify"
            >
              <SpotifyIcon />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black py-8 text-center">
        <p className="text-gray-600 text-[12px] font-meta tracking-[0.14em]">
          © 2026 Dwight Sabado. All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
};

export default About;
