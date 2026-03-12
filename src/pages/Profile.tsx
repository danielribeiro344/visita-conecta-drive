import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Shield, Car, LogOut, Pencil, Trash2, ChevronRight, RefreshCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, normalizeUsuarioStatus } from "@/lib/api";
import { clearSession, getSession } from "@/lib/session";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDriver = searchParams.get("role") === "motorista";
  const session = getSession();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["usuario", session?.userId],
    queryFn: () => api.getUsuario(Number(session?.userId) ?? 0),
    enabled: Boolean(session?.userId),
  });

  const driverQuery = useQuery({
    queryKey: ["motorista", session?.userId],
    queryFn: () => api.getMotorista(session?.userId ?? ""),
    enabled: Boolean(session?.userId && isDriver),
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!session?.userId || !userQuery.data) throw new Error("Usuario nao carregado");
      const updatedUser = await api.updateUsuario(Number(session.userId), {
        nome: userQuery.data.nome,
        email: userQuery.data.email,
        telefone: userQuery.data.telefone,
        senhaHash: userQuery.data.senhaHash ?? "",
        cpf: userQuery.data.cpf,
        status: userQuery.data.status,
        emailVerificado: userQuery.data.emailVerificado,
        telefoneVerificado: userQuery.data.telefoneVerificado,
        perfis: userQuery.data.perfis,
      });

      if (isDriver && detail) {
        await api.updateMotorista(session.userId, {
          usuarioId: session.userId,
          cnhNumero: detail.cnhNumero,
          cnhValidade: detail.cnhValidade,
          veiculoMarca: detail.veiculoMarca,
          veiculoModelo: detail.veiculoModelo,
          veiculoPlaca: detail.veiculoPlaca,
          aprovado: detail.aprovado,
          vehicleTypeId: detail.vehicleTypeId,
          veiculoAno: detail.veiculoAno,
          veiculoAssentos: detail.veiculoAssentos ?? detail.capacidadeVeiculo,
          veiculoCor: detail.veiculoCor,
          capacidadeVeiculo: detail.capacidadeVeiculo,
        });
      }

      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario", session?.userId] });
      toast.success("Perfil sincronizado com backend");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!session?.userId) throw new Error("Sessao invalida");

      if (isDriver) {
        await api.deleteMotorista(session.userId);
      }

      await api.deleteUsuario(session.userId);
    },
    onSuccess: () => {
      queryClient.clear();
      clearSession();
      toast.success("Conta excluida");
      navigate("/");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const user =
    userQuery.data ??
    (session
      ? {
          id: session.userId,
          nome: session.userName,
          email: session.email ?? "-",
          telefone: "-",
          cpf: "-",
          status: 1,
        }
      : undefined);
  const detail = driverQuery.data;

  const maskedCpf = useMemo(() => {
    const digits = (user?.cpf ?? "").replace(/\D/g, "");
    if (digits.length !== 11) return user?.cpf ?? "-";
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
  }, [user?.cpf]);

  const maskedPlaca = detail?.veiculoPlaca ? `${detail.veiculoPlaca.slice(0, 3)}-****` : "";
  const maskedCnh = detail?.cnhNumero ? `${detail.cnhNumero.slice(0, 3)}*****${detail.cnhNumero.slice(-2)}` : "";

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-6 pt-12 pb-10 rounded-b-3xl text-center relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 p-2 rounded-xl text-primary-foreground/80 hover:bg-primary-foreground/10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-primary-foreground/20">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">{user.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-bold text-primary-foreground">{user.nome}</h1>
        <p className="text-primary-foreground/60 text-sm">{session?.role === "MOTORISTA" ? "Motorista" : "Passageiro"}</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="text-center flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <p className="text-lg font-bold text-primary-foreground">-</p>
          </div>
          {isDriver && detail?.aprovado && (
            <>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-xs text-primary-foreground/80 font-medium">Verificado</span>
              </div>
            </>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 mt-6 space-y-4">
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Informacoes pessoais</h2>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Telefone" value={user.telefone} />
          <InfoRow label="CPF" value={maskedCpf} />
          <InfoRow label="Status" value={normalizeUsuarioStatus(user.status)} />
        </div>

        {isDriver && detail && (
          <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Veiculo</h2>
            </div>
            <InfoRow label="Modelo" value={detail.veiculoModelo} />
            <InfoRow label="Marca" value={detail.veiculoMarca ?? "-"} />
            <InfoRow label="Placa" value={maskedPlaca} />
            <InfoRow label="Ano" value={detail.veiculoAno ? String(detail.veiculoAno) : "-"} />
            <InfoRow label="Cor" value={detail.veiculoCor ?? "-"} />
            <InfoRow label="Capacidade" value={`${detail.veiculoAssentos ?? detail.capacidadeVeiculo ?? 4} passageiros`} />
            <InfoRow label="CNH" value={maskedCnh} />
            <InfoRow label="Aprovacao" value={detail.aprovado ? "Aprovado" : "Pendente"} />
          </div>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between h-12 rounded-2xl" onClick={() => refreshMutation.mutate()}>
            <span className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Sincronizar perfil
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>

          {isDriver && (
            <Button variant="outline" className="w-full justify-between h-12 rounded-2xl" onClick={() => navigate("/my-trips")}>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Ver minhas caronas
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-between h-12 rounded-2xl"
            onClick={() => {
              clearSession();
              navigate("/");
            }}
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sair
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="ghost" className="w-full h-10 text-xs text-destructive" onClick={() => deleteMutation.mutate()}>
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir conta
          </Button>

          <Button variant="ghost" className="w-full h-10 text-xs text-muted-foreground" onClick={() => {}}>
            <Pencil className="w-3.5 h-3.5 mr-1" /> Edicao manual (em breve)
          </Button>
        </div>
      </motion.div>

      <BottomNav active="profile" isDriver={isDriver} />
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

export default Profile;
