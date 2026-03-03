import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, MessageCircle, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockTrips, mockBookings } from '@/data/mockData';
import { BookingStatus } from '@/types';

const statusColors: Record<BookingStatus, string> = {
  Pendente: 'bg-warning/10 text-warning',
  Confirmada: 'bg-success/10 text-success',
  Cancelada: 'bg-destructive/10 text-destructive',
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = mockTrips.find(t => t.id === id);
  const tripBookings = mockBookings.filter(b => b.viagemId === id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carona não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 pt-4 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Detalhe da Carona</h1>

        {/* Trip info */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{trip.presidioNome}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(trip.dataSaida).toLocaleDateString('pt-BR')} • {trip.horaSaida}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {trip.vagasTotais - trip.vagasDisponiveis}/{trip.vagasTotais} vagas preenchidas
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-sm font-bold text-primary">R$ {trip.valor.toFixed(2)}/pessoa</p>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              trip.status === 'Ativa' ? 'bg-success/10 text-success' :
              trip.status === 'Lotada' ? 'bg-info/10 text-info' :
              trip.status === 'Finalizada' ? 'bg-muted text-muted-foreground' :
              'bg-destructive/10 text-destructive'
            }`}>
              {trip.status}
            </span>
          </div>
        </div>

        {/* Passengers */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Passageiros ({tripBookings.length})
          </h3>

          {tripBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum passageiro ainda</p>
          ) : (
            <div className="space-y-3">
              {tripBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary/20 text-secondary text-sm font-bold">
                      {(booking.passageiroNome || 'P').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{booking.passageiroNome}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{booking.passageiroCidade}</span>
                      <span>• {booking.quantidadeVagas} vaga(s)</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-warning fill-warning" /> 4.7
                      </span>
                    </div>
                  </div>
                  {booking.status === 'Confirmada' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl shrink-0"
                      onClick={() => navigate(`/chat?contact=${booking.passageiroId}&as=u2`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TripDetail;
