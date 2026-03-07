import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, XCircle, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TripStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useAppData } from "@/hooks/useAppData";
import { getSession } from "@/lib/session";
import { api } from "@/lib/api";

const statusColors: Record<TripStatus, string> = {
  Ativa: "bg-success/10 text-success",
  Lotada: "bg-info/10 text-info",
  Cancelada: "bg-destructive/10 text-destructive",
  Finalizada: "bg-muted text-muted-foreground",
};

const MyTrips = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = getSession();
  const { trips } = useAppData();

  const cancelMutation = useMutation({
    mutationFn: (tripId: string) => api.deleteViagem(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viagens"] });
      toast.info("Carona cancelada");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const driverTrips = useMemo(
    () => trips.filter((t) => t.motoristaId === Number(session?.userId)),
    [trips, session?.userId]
  );
  const upcoming = driverTrips.filter((t) => t.status === "Ativa");
  const full = driverTrips.filter((t) => t.status === "Lotada");
  const finished = driverTrips.filter((t) => t.status === "Finalizada");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-xl font-bold text-foreground mb-4">Minhas Caronas</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full bg-muted rounded-2xl h-11 p-1 mb-4">
            <TabsTrigger value="upcoming" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Proximas ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="full" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Lotadas ({full.length})
            </TabsTrigger>
            <TabsTrigger value="done" className="flex-1 rounded-xl text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Finalizadas ({finished.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3">
            {upcoming.map((trip, i) => (
              <TripItem
                key={trip.id}
                trip={trip}
                index={i}
                onCancel={() => cancelMutation.mutate(trip.id)}
                onDetail={() => navigate(`/trip/${trip.id}`)}
              />
            ))}
            {upcoming.length === 0 && <Empty />}
          </TabsContent>
          <TabsContent value="full" className="space-y-3">
            {full.map((trip, i) => (
              <TripItem key={trip.id} trip={trip} index={i} onDetail={() => navigate(`/trip/${trip.id}`)} />
            ))}
            {full.length === 0 && <Empty />}
          </TabsContent>
          <TabsContent value="done" className="space-y-3">
            {finished.map((trip, i) => (
              <TripItem key={trip.id} trip={trip} index={i} onDetail={() => navigate(`/trip/${trip.id}`)} />
            ))}
            {finished.length === 0 && <Empty />}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav active="trips" isDriver />
    </div>
  );
};

function TripItem({ trip, index, onCancel, onDetail }: { trip: any; index: number; onCancel?: () => void; onDetail: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl p-4 shadow-card cursor-pointer"
      onClick={onDetail}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{trip.presidioNome}</p>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[trip.status as TripStatus]}`}>{trip.status}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(trip.dataSaida).toLocaleDateString("pt-BR")} - {trip.horaSaida}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {trip.vagasTotais - trip.vagasDisponiveis}/{trip.vagasTotais} passageiros
        </span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-sm font-bold text-primary">R$ {trip.valor.toFixed(2)}/pessoa</p>
        <div className="flex items-center gap-2">
          {onCancel && trip.status === "Ativa" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="flex items-center gap-1 text-xs text-destructive font-medium"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancelar
            </button>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}

function Empty() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <p className="text-sm">Nenhuma carona nesta categoria</p>
    </div>
  );
}

export default MyTrips;
