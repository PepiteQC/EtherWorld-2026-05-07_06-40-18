export function ScanlineOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)'
      }}
    >
      <div className="scanline-bar" />
    </div>
  );
}
