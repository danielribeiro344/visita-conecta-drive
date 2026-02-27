import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockBookings } from '@/data/mockData';
import { BookingStatus } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNav from '@/components/BottomNav';

const statusColors: Record<BookingStatus, string> = {
  Pendente: 'bg-warning/10 text-warning',
  Confirmada: 'bg-success/10 text-success',
  Cancelada: 'bg-destructive/10 text-destructive',
};

const DriverRequests = () => {
  const navigate = useNavigate();
  // Show bookings for driver's trips
  const driverBookings = mockBookings.filter(b => b.trip?.motoristaId === 'u2');

  const pendentes = driverBookings.filter(b => b.status === 'Pendente');
  const confirmadas = driverBookings.filter(b => b.status === 'Confirmada');
  const canceladas = driverBookings.filter(b => b.status === 'Cancelada');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <div className="px-6 pt-2">
        <h1 className="text-xl font-bold text-foreground mb-4">Solicitações Recebidas</h1>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full bg-muted rounded-2xl h-11 p-1 mb-4">
            <TabsTrigger value="pending" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Pendentes ({pendentes.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Confirmadas ({confirmadas.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Canceladas ({canceladas.length})
            </TabsTrigger>
          </TabsList>

          {[
            { key: 'pending', items: pendentes },
            { key: 'confirmed', items: confirmadas },
            { key: 'cancelled', items: canceladas },
          ].map(({ key, items }) => (
            <TabsContent key={key} value={key} className="space-y-3">
              {items.map((booking, i) => (
                <motion.button
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/driver-request/${booking.id}`)}
                  className="w-full text-left bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-muted text-foreground text-sm font-semibold">
                        {(booking.passageiroNome || 'P').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground truncate">{booking.passageiroNome || 'Passageiro'}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {booking.quantidadeVagas} vaga(s)
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(booking.dataReserva).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{booking.trip?.presidioNome}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </motion.button>
              ))}
              {items.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-sm">Nenhuma solicitação nesta categoria</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BottomNav active="trips" isDriver />
    </div>
  );
};

export default DriverRequests;
