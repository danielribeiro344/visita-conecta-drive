import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, MapPin, MessageCircle, Star, RefreshCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types";
import { toast } from "sonner";
import { useAppData } from "@/hooks/useAppData";
import { api } from "@/lib/api";
import { toTrip } from "@/lib/mappers";

const statusColors: Record<BookingStatus, string> = {
  Pendente: "bg-warning/10 text-warning",
  Confirmada: "bg-success/10 text-success",
  Cancelada: "bg-destructive/10 text-destructive",
};

const TripDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { bookings, trips, usersById, prisons } = useAppData();

  const prisonsById = useMemo(() => {
    const map = new Map<string, typeof prisons[number]>();
    prisons.forEach((presidio) => map.set(presidio.id, presidio));
    return map;
  }, [prisons]);

  const tripApiQuery = useQuery({
    queryKey: ["viagem", id],
    queryFn: () => api.getViagem(id),
    enabled: Boolean(id),
  });

  const tripFromApi = useMemo(() => {
    if (!tripApiQuery.data) return undefined;
    return toTrip(tripApiQuery.data, usersById, prisonsById);
  }, [tripApiQuery.data, usersById, prisonsById]);

  const trip = trips.find((item) => item.id === id) ?? tripFromApi;
  const tripBookings = bookings.filter((b) => b.viagemId === id);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const raw = tripApiQuery.data;
      if (!raw) throw new Error("Viagem nao carregada");

      return api.updateViagem(id, {
        motoristaId: raw.motoristaId,
        presidioId: raw.presidioId,
        dataSaida: raw.dataSaida,
        valor: Number(raw.valor),
        vagasTotais: Number(raw.vagasTotais),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viagens"] });
      toast.success("Dados da viagem sincronizados");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!trip) {
    if (tripApiQuery.isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Carregando carona...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carona nao encontrada</p>
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

        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{trip.presidioNome}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(trip.dataSaida).toLocaleDateString("pt-BR")} - {trip.horaSaida}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {trip.vagasTotais - trip.vagasDisponiveis}/{trip.vagasTotais} vagas preenchidas
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-sm font-bold text-primary">R$ {trip.valor.toFixed(2)}/pessoa</p>
            <Button size="sm" variant="outline" onClick={() => syncMutation.mutate()}>
              <RefreshCcw className="w-3.5 h-3.5 mr-1" /> Sincronizar
            </Button>
          </div>
        </div>

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
                    <AvatarFallback className="bg-secondary/20 text-secondary text-sm font-bold">{(booking.passageiroNome || "P").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{booking.passageiroNome}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColors[booking.status]}`}>{booking.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{booking.passageiroCidade}</span>
                      <span>- {booking.quantidadeVagas} vaga(s)</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-warning fill-warning" /> 4.7
                      </span>
                    </div>
                  </div>
                  {booking.status === "Confirmada" && (
                    <Button size="sm" variant="outline" className="rounded-xl shrink-0" onClick={() => navigate(`/chat?contact=${booking.passageiroId}&as=${trip.motoristaId}&contactName=${encodeURIComponent(booking.passageiroNome || 'Passageiro')}&asName=${encodeURIComponent(trip.motoristaNome)}`)}>
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
