import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { openModal, isLoggedIn } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
      setShowScrollTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToJoin = () => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm border border-gray-700 hover:border-purple-600 text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center group"
          title="Retour en haut"
        >
          <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      
      {/* Join server CTA */}
      {!isLoggedIn && (
        <button
          onClick={() => openModal('register')}
          className="btn-primary w-12 h-12 rounded-full flex items-center justify-center group relative"
          title="Rejoindre ETHERWORLD RP"
        >
          <span className="text-white text-lg">🎮</span>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 whitespace-nowrap bg-black/90 border border-purple-700/40 px-3 py-1.5 rounded-lg font-rajdhani text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Rejoindre le serveur
          </div>
        </button>
      )}

      {/* Discord link */}
      <button
        className="w-12 h-12 rounded-full bg-[#5865f2]/20 backdrop-blur-sm border border-[#5865f2]/40 hover:bg-[#5865f2]/30 transition-all flex items-center justify-center group relative"
        title="Discord"
        onClick={scrollToJoin}
      >
        <svg className="w-5 h-5 text-[#5865f2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.013.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
        <div className="absolute left-full ml-3 whitespace-nowrap bg-black/90 border border-[#5865f2]/40 px-3 py-1.5 rounded-lg font-rajdhani text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Discord ETHERWORLD
        </div>
      </button>
    </div>
  );
}
