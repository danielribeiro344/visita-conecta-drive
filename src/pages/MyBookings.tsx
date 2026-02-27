import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { mockBookings } from '@/data/mockData';
import { BookingStatus } from '@/types';
import BottomNav from '@/components/BottomNav';

const statusColors: Record<BookingStatus, string> = {
  Pendente: 'bg-warning/10 text-warning',
  Confirmada: 'bg-success/10 text-success',
  Cancelada: 'bg-destructive/10 text-destructive',
};

const MyBookings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-xl font-bold text-foreground mb-6">Minhas Reservas</h1>

        <div className="space-y-3">
          {mockBookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">{booking.trip?.presidioNome}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {booking.trip && new Date(booking.trip.dataSaida).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {booking.quantidadeVagas} vaga(s)
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Motorista: {booking.trip?.motoristaNome}
                </p>
                <p className="text-sm font-bold text-primary">
                  R$ {booking.trip ? (booking.trip.valor * booking.quantidadeVagas).toFixed(2) : '0.00'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav active="bookings" />
    </div>
  );
};

export default MyBookings;
