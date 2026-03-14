import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Shield, Car, Calendar, MapPin, Users, MessageCircle, XCircle, Check, Clock, Flag } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, normalizeReservaStatus } from "@/lib/api";
import { useAppData } from "@/hooks/useAppData";
import { toTrip } from "@/lib/mappers";

const BookingDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { usersById, motoristas, trips, prisons } = useAppData();

  const prisonsById = useMemo(() => {
    const map = new Map<string, typeof prisons[number]>();
    prisons.forEach((presidio) => map.set(presidio.id, presidio));
    return map;
  }, [prisons]);

  const bookingQuery = useQuery({
    queryKey: ["reserva", id],
    queryFn: () => api.getReserva(id),
    enabled: Boolean(id),
  });

  const tripApiQuery = useQuery({
    queryKey: ["viagem", bookingData?.viagemId],
    queryFn: () => api.getViagem(bookingData?.viagemId ?? ""),
    enabled: Boolean(bookingData?.viagemId),
  });

  const tripFromApi = useMemo(() => {
    if (!tripApiQuery.data) return undefined;
    return toTrip(tripApiQuery.data, usersById, prisonsById);
  }, [tripApiQuery.data, usersById, prisonsById]);

  const bookingData = bookingQuery.data;
  const trip = trips.find((item) => item.id === bookingData?.viagemId) ?? tripFromApi;
  const driver = trip ? usersById.get(trip.motoristaId) : undefined;
  const driverDetail = trip ? motoristas.find((item) => item.usuarioId === trip.motoristaId) : undefined;
  const primaryVehicle = driverDetail?.vehicles?.[0];
  const vehicleName = driverDetail?.veiculoModelo ?? primaryVehicle?.model ?? primaryVehicle?.brand ?? "Veiculo";

  const [status, setStatus] = useState(bookingData ? normalizeReservaStatus(bookingData.status) : "Pendente");

  useEffect(() => {
    if (bookingData) {
      setStatus(normalizeReservaStatus(bookingData.status));
    }
  }, [bookingData]);

  const cancelMutation = useMutation({
    mutationFn: () => api.deleteReserva(id),
    onSuccess: () => {
      setStatus("Cancelada");
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.info("Reserva cancelada");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const total = useMemo(() => (trip ? trip.valor * Number(bookingData?.quantidadeVagas ?? 0) : 0), [trip, bookingData?.quantidadeVagas]);
  const placa = driverDetail?.veiculoPlaca ?? primaryVehicle?.plate;
  const maskedPlaca = placa ? placa.replace(/(.{3}).(.*)/, "$1-****") : "---";

  if (bookingQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando reserva...</p>
      </div>
    );
  }

  if (!bookingData || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva nao encontrada</p>
      </div>
    );
  }

  const timelineSteps = [
    { label: "Reserva solicitada", done: true, icon: Clock },
    { label: "Reserva aprovada", done: status === "Confirmada", icon: Check },
    { label: "Carona realizada", done: trip.status === "Finalizada", icon: Flag },
    { label: "Avaliacao", done: false, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Detalhe da Carona</h1>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {(driver?.nome ?? "M").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{driver?.nome ?? "Motorista"}</h2>
                {driverDetail?.aprovado && <Shield className="w-4 h-4 text-secondary" />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
            <Car className="w-4 h-4 text-primary" />
            <span>{vehicleName}</span>
            <span className="ml-auto font-medium text-foreground">{maskedPlaca}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Dados da Carona</h3>
          <InfoRow icon={MapPin} label="Presidio" value={trip.presidioNome} />
          <InfoRow icon={Calendar} label="Data e hora" value={`${new Date(trip.dataSaida).toLocaleDateString("pt-BR")} - ${trip.horaSaida}`} />
          <InfoRow icon={Users} label="Vagas reservadas" value={`${bookingData.quantidadeVagas}`} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">Valor total</span>
            <span className="text-base font-bold text-primary">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Linha do tempo</h3>
          <div className="space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  {i < timelineSteps.length - 1 && <div className={`w-0.5 h-6 ${step.done ? "bg-secondary" : "bg-border"}`} />}
                </div>
                <p className={`text-sm pt-1.5 ${step.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {status === "Confirmada" && (
            <Button onClick={() => navigate(`/chat?contact=${trip.motoristaId}&as=${bookingData.passageiroId}`)} className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" /> Conversar com Motorista
            </Button>
          )}

          {(status === "Pendente" || status === "Confirmada") && (
            <Button onClick={() => cancelMutation.mutate()} variant="outline" className="w-full h-12 rounded-2xl border-destructive text-destructive font-semibold">
              <XCircle className="w-4 h-4 mr-2" /> Cancelar Reserva
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default BookingDetail;
