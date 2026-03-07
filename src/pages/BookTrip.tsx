import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Calendar, Users, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/hooks/useAppData";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";

const BookTrip = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = getSession();

  const { trips } = useAppData();
  const trip = trips.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);

  const createBookingMutation = useMutation({
    mutationFn: () =>
      api.createReserva({
        viagemId: id,
        passageiroId: Number(session?.userId) ?? 0,
        quantidadeVagas: quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva realizada com sucesso");
      navigate("/my-bookings");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!trip || trip.status !== "Ativa") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carona nao disponivel</p>
      </div>
    );
  }

  const maxQuantity = trip.vagasDisponiveis;
  const total = trip.valor * quantity;

  const handleBook = () => {
    if (!session?.userId) {
      toast.error("Faca login novamente");
      navigate("/login");
      return;
    }

    createBookingMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Reservar carona</h1>

        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{trip.presidioNome}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(trip.dataSaida).toLocaleDateString("pt-BR")} - {trip.horaSaida}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {trip.vagasDisponiveis} vagas
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Motorista: {trip.motoristaNome}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
          <p className="text-sm font-semibold text-foreground mb-4">Quantidade de vagas</p>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-foreground">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-bold text-foreground w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-accent rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-accent-foreground/60 uppercase tracking-wide">Valor total</p>
              <p className="text-2xl font-bold text-accent-foreground">R$ {total.toFixed(2)}</p>
            </div>
            <p className="text-sm text-accent-foreground/60">
              {quantity}x R$ {trip.valor.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="px-6 pb-8 safe-bottom">
        <Button onClick={handleBook} disabled={createBookingMutation.isPending} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground">
          Confirmar reserva
        </Button>
      </div>
    </div>
  );
};

export default BookTrip;
