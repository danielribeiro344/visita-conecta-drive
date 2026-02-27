import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { mockPrisons, mockTrips } from '@/data/mockData';
import { Trip } from '@/types';
import BottomNav from '@/components/BottomNav';

const PassengerHome = () => {
  const navigate = useNavigate();
  const [selectedPrison, setSelectedPrison] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const activeTrips = mockTrips.filter(t => t.status === 'Ativa' || t.status === 'Lotada');

  const filteredTrips = selectedPrison
    ? activeTrips.filter(t => t.presidioId === selectedPrison)
    : activeTrips;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-6 pt-12 pb-8 rounded-b-3xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary-foreground/60 text-sm mb-1">Olá, Maria 👋</p>
          <h1 className="text-xl font-bold text-primary-foreground">Encontre sua viagem</h1>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 mt-5 shadow-elevated space-y-3"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Presídio</label>
            <select
              value={selectedPrison}
              onChange={(e) => setSelectedPrison(e.target.value)}
              className="w-full h-11 rounded-xl bg-muted px-3 text-sm text-foreground border-0 outline-none"
            >
              <option value="">Todos os presídios</option>
              {mockPrisons.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Quick access to prisons */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Presídios</h2>
          <span className="text-xs text-muted-foreground">{mockPrisons.length} unidades</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {mockPrisons.map((prison) => (
            <button
              key={prison.id}
              onClick={() => navigate(`/prison/${prison.id}`)}
              className="shrink-0 bg-card rounded-2xl p-4 shadow-card w-44 text-left hover:shadow-elevated transition-shadow"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4 text-accent-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight mb-1">{prison.nome}</p>
              <p className="text-xs text-muted-foreground">{prison.cidade}, {prison.estado}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Trips */}
      <div className="px-6 mt-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Viagens disponíveis</h2>
        <div className="space-y-3">
          {filteredTrips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} index={i} onClick={() => navigate(`/book/${trip.id}`)} />
          ))}
          {filteredTrips.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma viagem encontrada</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
};

function TripCard({ trip, index, onClick }: { trip: Trip; index: number; onClick: () => void }) {
  const isFull = trip.status === 'Lotada';

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      disabled={isFull}
      className={`w-full text-left bg-card rounded-2xl p-4 shadow-card transition-all ${
        isFull ? 'opacity-60' : 'hover:shadow-elevated active:scale-[0.98]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{trip.presidioNome}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(trip.dataSaida).toLocaleDateString('pt-BR')} • {trip.horaSaida}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {trip.vagasDisponiveis}/{trip.vagasTotais}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Motorista: {trip.motoristaNome}</p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-lg font-bold text-primary">R$ {trip.valor.toFixed(2)}</p>
          {isFull ? (
            <span className="text-xs font-medium text-destructive">Lotada</span>
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default PassengerHome;
