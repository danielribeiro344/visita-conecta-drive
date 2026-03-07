import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { BookingStatus } from "@/types";
import BottomNav from "@/components/BottomNav";
import { useAppData } from "@/hooks/useAppData";
import { getSession } from "@/lib/session";

const statusColors: Record<BookingStatus, string> = {
  Pendente: "bg-warning/10 text-warning",
  Confirmada: "bg-success/10 text-success",
  Cancelada: "bg-destructive/10 text-destructive",
};

const MyBookings = () => {
  const navigate = useNavigate();
  const session = getSession();
  const { bookings } = useAppData();

  const passengerBookings = useMemo(
    () => bookings.filter((booking) => booking.passageiroId === Number(session?.userId)),
    [bookings, session?.userId],
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-xl font-bold text-foreground mb-6">Minhas Reservas</h1>

        <div className="space-y-3">
          {passengerBookings.map((booking, i) => (
            <motion.button
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/booking/${booking.id}`)}
              className="w-full text-left bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">{booking.trip?.presidioNome ?? "Sem viagem"}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {booking.trip && new Date(booking.trip.dataSaida).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {booking.quantidadeVagas} vaga(s)
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Motorista: {booking.trip?.motoristaNome}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-primary">R$ {booking.trip ? (booking.trip.valor * booking.quantidadeVagas).toFixed(2) : "0.00"}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </motion.button>
          ))}

          {passengerBookings.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Voce ainda nao possui reservas.</p>}
        </div>
      </div>

      <BottomNav active="bookings" />
    </div>
  );
};

export default MyBookings;
