import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import onboardingHero from '@/assets/onboarding-hero.jpg';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Hero image background */}
      <div className="absolute inset-0">
        <img src={onboardingHero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 safe-bottom">
        {/* Logo area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 pt-16"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Bus className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary-foreground tracking-tight">
            ConectaVisita
          </span>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
            Transporte seguro<br />para dias de visita
          </h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Encontre motoristas verificados e viaje com tranquilidade para visitar quem você ama.
          </p>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mb-8"
        >
          <Shield className="w-4 h-4 text-secondary" />
          <span className="text-sm text-primary-foreground/60">Motoristas verificados • Viagens seguras</span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-3 pb-8"
        >
          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => navigate('/register')}
          >
            Criar conta
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-2xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            onClick={() => navigate('/login')}
          >
            Entrar
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
