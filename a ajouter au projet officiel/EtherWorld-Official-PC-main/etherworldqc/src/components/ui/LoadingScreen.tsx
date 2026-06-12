import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "> INITIALIZING ETHERWORLD CORE...",
  "> LOADING RP PROTOCOLS...",
  "> CONNECTING TO ROUTE 138...",
  "> CALIBRATING 3D ENGINE...",
  "> SYSTEM READY.",
];

export default function LoadingScreen({ onComplete, minDuration = 3000 }: { onComplete?: () => void; minDuration?: number }) {
  const [progress, setProgress] = useState(0);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const done = useCallback(() => { setIsComplete(true); setTimeout(() => onComplete?.(), 400); }, [onComplete]);

  useEffect(() => {
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(((Date.now() - start) / minDuration) * 100, 100);
      setProgress(p);
      if (p >= 100) { clearInterval(iv); done(); }
    }, 50);
    return () => clearInterval(iv);
  }, [minDuration, done]);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentLines((prev) => prev.length < LINES.length ? [...prev, LINES[prev.length]] : prev);
    }, 500);
    return () => clearInterval(iv);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080E]">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="scanlines absolute inset-0" />
          <div className="relative z-10 flex flex-col items-center gap-6 px-4">
            <h1 className="neon-glow font-mono text-4xl md:text-6xl font-bold text-white">ETHERWORLD</h1>
            <p className="neon-glow-green font-mono text-sm text-[#00FF9D]">LOADING</p>
            <div className="pixel-window w-full max-w-lg p-4">
              <div className="h-32 overflow-hidden font-mono text-xs text-emerald-400">
                {currentLines.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
            <div className="w-full max-w-md">
              <div className="pixel-border mb-2 h-4 w-full overflow-hidden bg-zinc-800">
                <motion.div className="h-full bg-cyan-500" style={{ width: `${progress}%`, boxShadow: "0 0 10px #00e0ff" }} />
              </div>
              <div className="flex justify-between font-mono text-xs text-zinc-500">
                <span>LOADING...</span>
                <span className="text-white">{Math.floor(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
