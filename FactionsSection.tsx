import { useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const factions = [
  {
    id: 'police',
    name: 'SPVQ',
    fullName: 'Service de Police de la Ville de Québec',
    side: 'law',
    icon: '🚔',
    color: '#3b82f6',
    darkColor: '#1e3a5f',
    badge: '🔵',
    tagline: 'Protéger & Servir',
    members: '12-20 joueurs',
    desc: 'La force de l\'ordre officielle d\'ETHERWORLD. Patrouilles, enquêtes, arrestations — tu es la dernière ligne entre le chaos et la loi.',
    perks: ['Équipement officiel complet', 'Radio sécurisée', 'Accès au casier judiciaire', 'Véhicules de patrouille', 'Protocoles internes stricts'],
    ranks: ['Cadet', 'Agent', 'Sergent', 'Lieutenant', 'Capitaine', 'Commandant'],
    req: 'Dossier propre IC + entrevue staff',
    color2: 'from-blue-900/40 to-blue-950/20',
  },
  {
    id: 'ems',
    name: 'EMS QUÉBEC',
    fullName: 'Services d\'Urgences Médicales',
    side: 'law',
    icon: '🚑',
    color: '#22c55e',
    darkColor: '#14532d',
    badge: '🟢',
    tagline: 'Sauver des Vies',
    members: '8-15 joueurs',
    desc: 'Sans vous, les morts restent morts. L\'EMS d\'ETHERWORLD est indispensable — médecins, paramedics, et chirurgiens. Zone safe garantie.',
    perks: ['Immunité dans les zones de conflit', 'Équipement médical avancé', 'Ambulances & hélicoptères', 'Salaire gouvernemental', 'Formation RP poussée'],
    ranks: ['Stagiaire', 'Technicien', 'Paramédic', 'Médecin', 'Chef médical'],
    req: 'Bonne gestion du stress RP + disponibilité',
    color2: 'from-green-900/40 to-green-950/20',
  },
  {
    id: 'gouvernement',
    name: 'GOUVERNEMENT',
    fullName: 'Administration de Québec City',
    side: 'law',
    icon: '🏛️',
    color: '#f59e0b',
    darkColor: '#78350f',
    badge: '🟡',
    tagline: 'Gouverner l\'Éther',
    members: '5-10 joueurs',
    desc: 'Lois, décrets, budgets, diplomatie — le gouvernement contrôle les règles du jeu légal. Influence politique maximale, cibles criminelles majeures.',
    perks: ['Pouvoir législatif IC', 'Budget de la ville', 'Diplomatie avec les factions', 'Accès aux dossiers confidentiels', 'Véhicules gouvernementaux'],
    ranks: ['Conseiller', 'Attaché', 'Ministre', 'Premier Ministre'],
    req: 'Réputation RP + ancienneté sur le serveur',
    color2: 'from-yellow-900/40 to-yellow-950/20',
  },
  {
    id: 'cartel',
    name: 'CARTEL DE L\'ETHER',
    fullName: 'Organisation Criminelle Principale',
    side: 'criminal',
    icon: '💀',
    color: '#ef4444',
    darkColor: '#7f1d1d',
    badge: '🔴',
    tagline: 'L\'Éther Appartient aux Loups',
    members: '15-25 joueurs',
    desc: 'Le cartel dominant de Québec City. Drogues, armes, territoire — tu joues dans la grande ligue. Loyauté absolue ou mort.',
    perks: ['Territoire exclusif', 'Accès aux labos clandestins', 'Réseau de revendeursIC', 'Armement lourd', 'Protection des soldats'],
    ranks: ['Recrue', 'Soldat', 'Capo', 'Sous-patron', 'Patron'],
    req: 'Invité par un membre + mission de sang RP',
    color2: 'from-red-900/40 to-red-950/20',
  },
  {
    id: 'indep',
    name: 'INDÉPENDANTS',
    fullName: 'Joueurs Non Affiliés',
    side: 'neutral',
    icon: '🎭',
    color: '#8b5cf6',
    darkColor: '#3b0764',
    badge: '🟣',
    tagline: 'Ton Destin, Tes Règles',
    members: 'Illimité',
    desc: 'Ni flic ni criminel. Tu construis ton propre empire — commerce, influence, survie. La liberté totale a un prix : tu es seul.',
    perks: ['Liberté totale', 'Aucune obligation', 'Accès à tous les commerces', 'Possibilité de changer de camp', 'Rôles uniques disponibles'],
    ranks: ['Citoyen', 'Entrepreneur', 'Notable', 'Influent'],
    req: 'Aucun — commence ici',
    color2: 'from-purple-900/40 to-purple-950/20',
  },
];

export default function FactionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.05 });
  const [selected, setSelected] = useState(factions[0]);

  return (
    <section id="factions" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060408] to-black" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-700/40 text-xs font-rajdhani text-red-400 tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            FACTIONS & ORGANISATIONS
          </div>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            CHOISIS <span className="gradient-text">TON CAMP</span>
          </h2>
          <p className="font-rajdhani text-xl text-gray-400 max-w-2xl mx-auto">
            Chaque faction a ses codes, ses ambitions, ses ennemis. Rejoins les tiens — ou crée les tiens.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Faction selector */}
          <div className={`xl:w-80 flex xl:flex-col gap-3 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {factions.map((faction) => (
              <button
                key={faction.id}
                onClick={() => setSelected(faction)}
                className={`flex-shrink-0 xl:flex-shrink flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${
                  selected.id === faction.id
                    ? 'border-purple-600/60 bg-purple-900/20'
                    : 'border-gray-800/60 bg-black/40 hover:border-gray-700'
                }`}
              >
                <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ background: `${faction.color}20`, border: `1px solid ${faction.color}40` }}>
                  {faction.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron font-bold text-white text-sm truncate">{faction.name}</div>
                  <div className="font-rajdhani text-xs truncate" style={{ color: faction.color }}>
                    {faction.side === 'law' ? '⚖️ Légal' : faction.side === 'criminal' ? '💀 Criminel' : '🎭 Neutre'}
                  </div>
                </div>
                {selected.id === faction.id && (
                  <div className="ml-auto w-1.5 h-6 rounded-full flex-shrink-0" style={{ background: faction.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Faction detail */}
          <div className={`flex-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative p-8 rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${selected.darkColor}40, #000)`, border: `1px solid ${selected.color}30` }}>
              
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ background: selected.color }} />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="text-6xl sm:text-7xl">{selected.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-orbitron font-black text-3xl sm:text-4xl text-white leading-tight">{selected.name}</div>
                    <div className="font-rajdhani text-gray-400 text-lg mt-1">{selected.fullName}</div>
                    <div className="font-rajdhani font-bold text-xl mt-2 italic" style={{ color: selected.color }}>
                      "{selected.tagline}"
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-xs font-rajdhani text-gray-500">
                        👥 {selected.members}
                      </span>
                      <span className="text-xs font-rajdhani px-2 py-0.5 rounded-full"
                        style={{ color: selected.color, background: `${selected.color}15`, border: `1px solid ${selected.color}30` }}>
                        {selected.side === 'law' ? '⚖️ FACTION LÉGALE' : selected.side === 'criminal' ? '💀 ORGANISATION CRIMINELLE' : '🎭 NEUTRE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-rajdhani text-lg text-gray-300 leading-relaxed mb-8">{selected.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Perks */}
                  <div className="md:col-span-1">
                    <h4 className="font-orbitron font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <span>⚡</span> AVANTAGES
                    </h4>
                    <ul className="space-y-2">
                      {selected.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 font-rajdhani text-sm text-gray-400">
                          <span style={{ color: selected.color }} className="mt-0.5">▸</span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ranks */}
                  <div>
                    <h4 className="font-orbitron font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <span>🏆</span> GRADES
                    </h4>
                    <div className="flex flex-col gap-2">
                      {selected.ranks.map((rank, i) => (
                        <div key={rank} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded text-center text-xs font-orbitron font-black flex items-center justify-center"
                            style={{ background: `${selected.color}${Math.floor(255 * (i + 1) / selected.ranks.length).toString(16).padStart(2, '0')}`, color: 'white' }}>
                            {i + 1}
                          </div>
                          <span className="font-rajdhani text-sm text-gray-400">{rank}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements & CTA */}
                  <div>
                    <h4 className="font-orbitron font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <span>📋</span> CONDITION
                    </h4>
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 mb-6">
                      <p className="font-rajdhani text-sm text-gray-400">{selected.req}</p>
                    </div>
                    <button className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-wider transition-all hover:brightness-110 hover:shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${selected.color}, ${selected.darkColor})`,
                        boxShadow: `0 0 20px ${selected.color}30`
                      }}>
                      REJOINDRE LA FACTION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
