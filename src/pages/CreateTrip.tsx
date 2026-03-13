import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useAppData } from "@/hooks/useAppData";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";

const CreateTrip = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = getSession();
  const { prisons } = useAppData();

  const [prison, setPrison] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");

  const motoristaQuery = useQuery({
    queryKey: ["motorista", session?.userId],
    queryFn: () => api.getMotorista(Number(session?.userId) ?? 0),
    enabled: Boolean(session?.userId),
  });

  const primaryVehicle = motoristaQuery.data?.vehicles?.[0];
  const vehicleId = motoristaQuery.data?.vehicleId ?? primaryVehicle?.id;

  const createMutation = useMutation({
    mutationFn: () =>
      api.createViagem({
        motoristaId: Number(session?.userId) ?? 0,
        vehicleId,
        presidioId: prison,
        dataSaida: new Date(`${date}T${time}`).toISOString(),
        valor: Number(price),
        vagasTotais: Number(seats),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viagens"] });
      toast.success("Carona criada com sucesso");
      navigate("/my-trips");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const maxSeats =
    motoristaQuery.data?.veiculoAssentos ?? motoristaQuery.data?.capacidadeVeiculo ?? primaryVehicle?.seats ?? 4;
  const vehicleName =
    motoristaQuery.data?.veiculoModelo ?? primaryVehicle?.model ?? primaryVehicle?.brand ?? "Veiculo";
  const seatsNum = parseInt(seats) || 0;
  const seatsExceeded = seatsNum > maxSeats;

  const handleCreate = () => {
    if (!session?.userId) {
      toast.error("Faca login novamente");
      return;
    }

    if (!prison || !date || !time || !price || !seats) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!vehicleId) {
      toast.error("Nao foi possivel identificar o veiculo do motorista. Atualize seu perfil e tente novamente.");
      return;
    }

    if (seatsNum < 1) {
      toast.error("Informe pelo menos 1 vaga");
      return;
    }

    if (seatsExceeded) {
      toast.error(`Seu veiculo (${vehicleName}) suporta no maximo ${maxSeats} passageiros.`);
      return;
    }

    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 pt-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">Criar carona</h1>
        <p className="text-muted-foreground text-sm mb-6">Preencha os dados da carona</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Presidio</Label>
            <select value={prison} onChange={(e) => setPrison(e.target.value)} className="w-full h-12 rounded-xl bg-muted px-3 text-sm text-foreground border-0 outline-none">
              <option value="">Selecione o presidio</option>
              {prisons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data de saida</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Horario</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Valor por passageiro</Label>
              <Input type="number" placeholder="R$ 0,00" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Total de vagas</Label>
              <Input
                type="number"
                placeholder="0"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className={`h-12 rounded-xl ${seatsExceeded ? "border-destructive ring-destructive" : ""}`}
                max={maxSeats}
              />
            </div>
          </div>

          <div className={`rounded-2xl p-4 flex items-start gap-3 ${seatsExceeded ? "bg-destructive/10 border border-destructive/20" : "bg-muted"}`}>
            {seatsExceeded && <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
            <div className="text-sm">
              <p className={seatsExceeded ? "text-destructive font-medium" : "text-muted-foreground"}>
                {seatsExceeded ? "Quantidade excede a capacidade do veiculo" : "Capacidade do veiculo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {vehicleName} - max. <strong>{maxSeats}</strong> passageiros
              </p>
            </div>
          </div>

          <Button onClick={handleCreate} disabled={seatsExceeded || createMutation.isPending} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground mt-4">
            Criar carona
          </Button>
        </div>
      </motion.div>

      <BottomNav active="create" isDriver />
    </div>
  );
};

export default CreateTrip;
