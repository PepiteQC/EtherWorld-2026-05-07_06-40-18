import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { VipAdminAvatar } from '@/components/admin/vip-admin-avatar'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, username, diamonds, credits')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: roomsCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })

  const { count: furnitureCount } = await supabase
    .from('furniture')
    .select('*', { count: 'exact', head: true })

  const adminName = profile?.username ?? user.email?.split('@')[0] ?? 'ADMIN'

  const ADMIN_SECTIONS = [
    {
      href: '/admin/users',
      icon: '⬡',
      label: 'USER MANAGEMENT',
      desc: 'Voir les utilisateurs, gerer les permissions, bannir des comptes',
      color: '#00ffcc',
    },
    {
      href: '/admin/rooms',
      icon: '◈',
      label: 'ROOM MANAGEMENT',
      desc: 'Voir toutes les rooms, supprimer, gerer la visibilite',
      color: '#ffd700',
    },
    {
      href: '/admin/furniture',
      icon: '◆',
      label: 'FURNITURE CATALOG',
      desc: 'Ajouter, modifier, supprimer les meubles du catalogue',
      color: '#ff9900',
    },
    {
      href: '/admin/moderation',
      icon: '⊗',
      label: 'MODERATION',
      desc: 'Signalements, bans, logs de moderation',
      color: '#ff3333',
    },
  ]

  return (
    <div className="relative min-h-screen space-y-8 p-4 md:p-8">

      {/* Ambient bg grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#ff333322 1px, transparent 1px), linear-gradient(90deg, #ff333322 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Page header */}
      <div
        className="relative z-10 border-2 border-[#ff3333] bg-[#0a0005] px-6 py-4"
        style={{ boxShadow: '0 0 30px #ff333355, inset 0 0 20px #ff333311' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="font-[family-name:var(--font-pixel)] text-xl text-[#ff3333]"
            style={{ textShadow: '0 0 16px #ff3333' }}
          >
            ETHERWORLD // PANNEAU ADMIN SUPREME
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#ff3333]" style={{ boxShadow: '0 0 6px #ff3333', animation: 'pulse 1s infinite' }} />
            <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#ff3333]">SYSTEME ACTIF</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-[#ffffff55] font-[family-name:var(--font-pixel)]">
          ACCES RESTREINT — NIVEAU DIVIN REQUIS
        </p>
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[280px_1fr]">

        {/* VIP Avatar column */}
        <div className="flex flex-col gap-4">
          <VipAdminAvatar username={adminName.toUpperCase()} />

          {/* System terminal widget */}
          <div
            className="border border-[#ff333344] bg-[#0a0005] p-4"
            style={{ boxShadow: '0 0 12px #ff333322' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#ff3333]" style={{ boxShadow: '0 0 6px #ff3333' }} />
              <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#ff3333]">TERMINAL ADMIN</span>
            </div>
            <div className="space-y-1 font-[family-name:var(--font-pixel)] text-[9px] text-[#00ffcc66]">
              <div>{'>'} CONNEXION: ETABLIE</div>
              <div>{'>'} NIVEAU: SUPREME</div>
              <div>{'>'} ACCES: TOTAL</div>
              <div className="text-[#ffd70088]">{'>'} BIENVENUE, ETHER-DIEU</div>
              <div className="mt-2 animate-pulse text-[#ff333388]">{'>'} _</div>
            </div>
          </div>
        </div>

        {/* Right column: stats + admin panels */}
        <div className="flex flex-col gap-6">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'UTILISATEURS', value: usersCount ?? 0, color: '#00ffcc', icon: '⬡' },
              { label: 'ROOMS', value: roomsCount ?? 0, color: '#ffd700', icon: '◈' },
              { label: 'MEUBLES', value: furnitureCount ?? 0, color: '#ff9900', icon: '◆' },
            ].map(stat => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 border border-current bg-[#0a0005] py-6"
                style={{
                  borderColor: stat.color + '55',
                  boxShadow: `0 0 16px ${stat.color}22`,
                }}
              >
                <span className="text-2xl" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}` }}>
                  {stat.icon}
                </span>
                <span
                  className="font-[family-name:var(--font-pixel)] text-3xl font-bold"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}` }}
                >
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#ffffff44]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Admin section cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ADMIN_SECTIONS.map(section => (
              <Link key={section.href} href={section.href}>
                <div
                  className="group relative overflow-hidden border bg-[#0a0005] p-6 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    borderColor: section.color + '44',
                    boxShadow: `0 0 0 0 ${section.color}`,
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${section.color}55`
                    ;(e.currentTarget as HTMLElement).style.borderColor = section.color
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent'
                    ;(e.currentTarget as HTMLElement).style.borderColor = section.color + '44'
                  }}
                >
                  {/* Scanline on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${section.color}08 3px, ${section.color}08 4px)`,
                    }}
                  />
                  <div
                    className="mb-3 font-[family-name:var(--font-pixel)] text-2xl"
                    style={{ color: section.color, textShadow: `0 0 12px ${section.color}` }}
                  >
                    {section.icon}
                  </div>
                  <h2
                    className="mb-2 font-[family-name:var(--font-pixel)] text-sm"
                    style={{ color: section.color, textShadow: `0 0 8px ${section.color}66` }}
                  >
                    {section.label}
                  </h2>
                  <p className="font-[family-name:var(--font-pixel)] text-[9px] leading-relaxed text-[#ffffff44]">
                    {section.desc}
                  </p>
                  <div
                    className="mt-4 inline-block border px-3 py-1 font-[family-name:var(--font-pixel)] text-[8px] transition-colors"
                    style={{ borderColor: section.color + '66', color: section.color + 'aa' }}
                  >
                    {'>'} ACCEDER
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
