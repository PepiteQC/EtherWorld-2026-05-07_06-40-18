import { motion } from "framer-motion";

export function FleurDeLisBackground() {
  // Generate random positions, sizes, opacities, and rotations for the background elements
  const fleurs = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 250 + 50,
    rotation: Math.random() * 360,
    opacity: Math.random() * 0.09 + 0.03, // 3% to 12%
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {fleurs.map((f) => (
        <motion.div
          key={f.id}
          className="absolute text-primary mix-blend-screen"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
          }}
          animate={{
            rotate: [f.rotation, f.rotation + 15, f.rotation - 15, f.rotation],
            scale: [1, 1.05, 0.95, 1],
            filter: [
              "hue-rotate(0deg)", 
              "hue-rotate(90deg)", 
              "hue-rotate(0deg)"
            ],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 C50 10, 45 25, 40 35 C35 45, 20 40, 15 35 C15 35, 25 50, 40 55 C40 55, 30 70, 20 70 C20 70, 35 75, 45 60 C45 60, 48 85, 48 85 L52 85 C52 85, 55 60, 55 60 C65 75, 80 70, 80 70 C70 70, 60 55, 60 55 C75 50, 85 35, 85 35 C80 40, 65 45, 60 35 C55 25, 50 10, 50 10 Z" />
            <rect x="35" y="65" width="30" height="5" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
