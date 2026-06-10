import { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const features = [
  {
    icon: '🌆',
    title: 'Québec City Vivant',
    desc: 'Une carte ultra-détaillée de Québec City avec des lieux emblématiques, des ruelles sombres et des quartiers criminels qui respirent la vie.',
    color: 'from-purple-600 to-purple-900',
    border: 'border-purple-700/40',
  },
  {
    icon: '⚔️',
    title: 'Factions en Guerre',
    desc: 'Police, criminels, EMS, gouvernement — chaque faction a ses protocoles, ses secrets et ses ambitions. Choisis ton camp ou joue double jeu.',
    color: 'from-red-600 to-red-900',
    border: 'border-red-700/40',
  },
  {
    icon: '🎭',
    title: 'Roleplay Immersif',
    desc: 'Un règlement strict qui garantit la qualité du RP. Personnages réalistes, économie dynamique, conséquences réelles de tes choix.',
    color: 'from-cyan-600 to-cyan-900',
    border: 'border-cyan-700/40',
  },
  {
    icon: '💰',
    title: 'Économie Réelle',
    desc: 'Dollar canadien, transactions, salaires, commerces joueurs, marché noir. Accumule ta fortune légalement... ou pas.',
    color: 'from-yellow-600 to-yellow-900',
    border: 'border-yellow-700/40',
  },
  {
    icon: '🏗️',
    title: 'Monde Évolutif',
    desc: 'Le monde change selon les décisions du staff et des joueurs. Nouvelles zones, événements, coups de théâtre — rien n\'est permanent.',
    color: 'from-blue-600 to-blue-900',
    border: 'border-blue-700/40',
  },
  {
    icon: '🔒',
    title: 'Serveur Sécurisé',
    desc: 'Architecture Firebase + anti-cheat côté serveur. Système de rôles hiérarchique pour un staff professionnel et transparent.',
    color: 'from-green-600 to-green-900',
    border: 'border-green-700/40',
  },
];

const timeline = [
  { phase: '01', title: 'Fondations', status: 'done', desc: 'Auth Firebase, profils Firestore, Colyseus GameRoom' },
  { phase: '02', title: 'Monde & Meubles', status: 'active', desc: 'Map Three.js, système de meubles, zones RP' },
  { phase: '03', title: 'Gameplay Complet', status: 'upcoming', desc: 'Inventaire, économie, jobs, chat RP' },
  { phase: '04', title: 'Admin & Sécurité', status: 'upcoming', desc: 'Menu admin, anti-cheat, logs d\'action' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-700/40 text-xs font-rajdhani text-purple-400 tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
            À PROPOS DU SERVEUR
          </div>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            PLUS QU'UN <span className="gradient-text">SERVEUR</span>
          </h2>
          <p className="font-rajdhani text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ETHERWORLD RP n'est pas juste un serveur FiveM. C'est une communauté, une économie, 
            un monde vivant façonné par chaque décision que tu prends.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`card-hover relative p-6 rounded-2xl bg-black/50 backdrop-blur-sm neon-border group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-3">{feat.title}</h3>
              <p className="font-rajdhani text-gray-400 leading-relaxed">{feat.desc}</p>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        {/* Development timeline */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="font-orbitron font-black text-2xl text-center text-white mb-12">
            ROADMAP DE DÉVELOPPEMENT
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'linear-gradient(to bottom, transparent, #7c3aed, #06b6d4, transparent)' }} />
            
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={item.phase}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block p-4 rounded-xl bg-black/60 border transition-all ${
                      item.status === 'done' ? 'border-green-700/50 bg-green-900/10' :
                      item.status === 'active' ? 'border-purple-700/50 bg-purple-900/10' :
                      'border-gray-800/50'
                    }`}>
                      <div className="font-orbitron font-black text-sm mb-1" style={{
                        color: item.status === 'done' ? '#22c55e' : item.status === 'active' ? '#a855f7' : '#4b5563'
                      }}>
                        PHASE {item.phase} — {item.title}
                      </div>
                      <div className="font-rajdhani text-gray-400">{item.desc}</div>
                      <div className={`inline-flex items-center gap-1.5 mt-2 text-xs font-rajdhani font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'done' ? 'bg-green-900/30 text-green-400' :
                        item.status === 'active' ? 'bg-purple-900/30 text-purple-400' :
                        'bg-gray-900/30 text-gray-500'
                      }`}>
                        {item.status === 'done' ? '✓ Complété' : item.status === 'active' ? '⚡ En cours' : '○ À venir'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex w-10 h-10 rounded-full items-center justify-center flex-shrink-0 font-orbitron font-black text-sm z-10"
                    style={{
                      background: item.status === 'done' ? '#14532d' : item.status === 'active' ? '#4c1d95' : '#111827',
                      border: `2px solid ${item.status === 'done' ? '#22c55e' : item.status === 'active' ? '#7c3aed' : '#374151'}`,
                      color: item.status === 'done' ? '#22c55e' : item.status === 'active' ? '#a855f7' : '#6b7280'
                    }}
                  >
                    {item.phase}
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
