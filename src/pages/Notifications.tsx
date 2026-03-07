import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, CheckCircle, XCircle, AlertTriangle, Ticket } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAppData } from "@/hooks/useAppData";
import { getSession } from "@/lib/session";

interface AppNotification {
  id: string;
  tipo: "reserva_nova" | "reserva_aprovada" | "reserva_recusada" | "viagem_cancelada";
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

const iconMap: Record<string, any> = {
  reserva_nova: Ticket,
  reserva_aprovada: CheckCircle,
  reserva_recusada: XCircle,
  viagem_cancelada: AlertTriangle,
};

const colorMap: Record<string, string> = {
  reserva_nova: "bg-info/10 text-info",
  reserva_aprovada: "bg-success/10 text-success",
  reserva_recusada: "bg-destructive/10 text-destructive",
  viagem_cancelada: "bg-warning/10 text-warning",
};

const Notifications = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();
  const isDriver = searchParams.get("role") === "motorista";

  const { bookings } = useAppData();

  const notifications = useMemo<AppNotification[]>(() => {
    if (isDriver) {
      return bookings
        .filter((b) => b.trip?.motoristaId === session?.userId)
        .map((b) => ({
          id: b.id,
          tipo: b.status === "Pendente" ? "reserva_nova" : b.status === "Confirmada" ? "reserva_aprovada" : "reserva_recusada",
          titulo: b.status === "Pendente" ? "Nova solicitacao" : b.status === "Confirmada" ? "Reserva aprovada" : "Reserva recusada",
          mensagem: `${b.passageiroNome} solicitou ${b.quantidadeVagas} vaga(s) para ${b.trip?.presidioNome}.`,
          data: b.dataReserva,
          lida: b.status !== "Pendente",
        }))
        .sort((a, b) => (a.data < b.data ? 1 : -1));
    }

    return bookings
      .filter((b) => b.passageiroId === session?.userId)
      .map((b) => ({
        id: b.id,
        tipo: b.status === "Confirmada" ? "reserva_aprovada" : b.status === "Cancelada" ? "reserva_recusada" : "reserva_nova",
        titulo: b.status === "Confirmada" ? "Reserva aprovada" : b.status === "Cancelada" ? "Reserva cancelada" : "Reserva enviada",
        mensagem: `Status da sua reserva para ${b.trip?.presidioNome}: ${b.status}.`,
        data: b.dataReserva,
        lida: b.status !== "Pendente",
      }))
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [bookings, isDriver, session?.userId]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <div className="px-6 pt-2">
        <h1 className="text-xl font-bold text-foreground mb-4">Notificacoes</h1>

        <div className="space-y-3">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.tipo] || Bell;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card rounded-2xl p-4 shadow-card ${!n.lida ? "border-l-4 border-l-primary" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[n.tipo]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{n.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.mensagem}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(n.data).toLocaleDateString("pt-BR")} - {new Date(n.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma notificacao</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="notifications" isDriver={isDriver} />
    </div>
  );
};

export default Notifications;
