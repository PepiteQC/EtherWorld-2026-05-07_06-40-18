import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsTicker from './components/StatsTicker';
import AboutSection from './components/AboutSection';
import LieuxSection from './components/LieuxSection';
import FactionsSection from './components/FactionsSection';
import RulesSection from './components/RulesSection';
import MapSection from './components/MapSection';
import JoinSection from './components/JoinSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import LiveDashboard from './components/LiveDashboard';
import FloatingActions from './components/FloatingActions';
import { useStore } from './store/useStore';

export default function App() {
  const { activeModal } = useStore();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero with 3D scene */}
      <HeroSection />
      
      {/* Live events ticker */}
      <StatsTicker />
      
      {/* About */}
      <AboutSection />
      
      {/* Interactive Map */}
      <MapSection />
      
      {/* Lieux & Commerces */}
      <LieuxSection />
      
      {/* Factions */}
      <FactionsSection />
      
      {/* Rules */}
      <RulesSection />
      
      {/* Join */}
      <JoinSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Auth Modal */}
      {(activeModal === 'login' || activeModal === 'register') && <AuthModal />}
      
      {/* Live Dashboard (shown when logged in) */}
      <LiveDashboard />
      
      {/* Floating action buttons */}
      <FloatingActions />
    </div>
  );
}
