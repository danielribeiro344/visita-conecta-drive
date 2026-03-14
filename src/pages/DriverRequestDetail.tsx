import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, MessageCircle, CheckCircle, XCircle, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, normalizeReservaStatus } from "@/lib/api";
import { useAppData } from "@/hooks/useAppData";
import { toTrip } from "@/lib/mappers";

const DriverRequestDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { trips, usersById, prisons } = useAppData();

  const prisonsById = useMemo(() => {
    const map = new Map<string, typeof prisons[number]>();
    prisons.forEach((presidio) => map.set(presidio.id, presidio));
    return map;
  }, [prisons]);

  const reservaQuery = useQuery({
    queryKey: ["reserva", id],
    queryFn: () => api.getReserva(id),
    enabled: Boolean(id),
  });

  const tripApiQuery = useQuery({
    queryKey: ["viagem", reservaQuery.data?.viagemId],
    queryFn: () => api.getViagem(reservaQuery.data?.viagemId ?? ""),
    enabled: Boolean(reservaQuery.data?.viagemId),
  });

  const tripFromApi = useMemo(() => {
    if (!tripApiQuery.data) return undefined;
    return toTrip(tripApiQuery.data, usersById, prisonsById);
  }, [tripApiQuery.data, usersById, prisonsById]);

  const raw = reservaQuery.data;
  const trip = raw ? (trips.find((item) => item.id === raw.viagemId) ?? tripFromApi) : undefined;
  const passenger = raw ? usersById.get(raw.passageiroId) : undefined;

  const [status, setStatus] = useState(raw ? normalizeReservaStatus(raw.status) : "Pendente");

  useEffect(() => {
    if (raw) {
      setStatus(normalizeReservaStatus(raw.status));
    }
  }, [raw]);

  const statusMutation = useMutation({
    mutationFn: (nextStatus: number) => api.patchReservaStatus(id, { status: nextStatus, avaliacaoMotorista: nextStatus === 2 ? 5 : undefined }),
    onSuccess: (_, nextStatus) => {
      const local = nextStatus === 2 ? "Confirmada" : "Cancelada";
      setStatus(local);
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success(local === "Confirmada" ? "Reserva aprovada com sucesso" : "Reserva recusada");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (reservaQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando reserva...</p>
      </div>
    );
  }

  if (!raw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva nao encontrada</p>
      </div>
    );
  }

  const total = trip ? trip.valor * raw.quantidadeVagas : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Detalhe da Reserva</h1>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-secondary/20 text-secondary text-lg font-bold">{(passenger?.nome || "P").charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground">{passenger?.nome ?? "Passageiro"}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {passenger?.cidade || "Sao Paulo"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-sm font-bold text-foreground">4.7</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">-</p>
              <p className="text-muted-foreground">Caronas realizadas</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Shield className="w-4 h-4 text-secondary" /> {passenger?.status ?? "Ativo"}
              </p>
              <p className="text-muted-foreground">Status da conta</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">Dados da Reserva</h3>
          <InfoRow label="Presidio" value={trip?.presidioNome || ""} />
          <InfoRow label="Data da carona" value={trip ? new Date(trip.dataSaida).toLocaleDateString("pt-BR") : ""} />
          <InfoRow label="Vagas" value={`${raw.quantidadeVagas}`} />
          <InfoRow label="Valor total" value={`R$ ${total.toFixed(2)}`} />
          <InfoRow label="Status" value={status} />
        </div>

        <div className="space-y-3">
          {status === "Pendente" && (
            <div className="flex gap-3">
              <Button onClick={() => statusMutation.mutate(2)} className="flex-1 h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> Aprovar
              </Button>
              <Button onClick={() => statusMutation.mutate(3)} variant="outline" className="flex-1 h-14 rounded-2xl border-destructive text-destructive font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> Recusar
              </Button>
            </div>
          )}

          {status === "Confirmada" && (
            <Button onClick={() => navigate(`/chat?contact=${raw.passageiroId}&as=${trip?.motoristaId}`)} className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" /> Enviar mensagem
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default DriverRequestDetail;
