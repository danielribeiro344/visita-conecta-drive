import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, User, Car } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { saveLocalAccount, setSession } from "@/lib/session";

const VEHICLE_TYPES: { id: number; label: string; capacity: number }[] = [
  { id: 1, label: "Carro (sedan/hatch) - 4 lugares", capacity: 4 },
  { id: 2, label: "SUV / Minivan - 7 lugares", capacity: 7 },
  { id: 3, label: "Van - 15 lugares", capacity: 15 },
  { id: 4, label: "Micro-onibus - 20 lugares", capacity: 20 },
];

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"profile" | "driver">("profile");
  const [selectedRole, setSelectedRole] = useState<"PASSAGEIRO" | "MOTORISTA" | null>(null);
  const [vehicleType, setVehicleType] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const [cnhNumero, setCnhNumero] = useState("");
  const [cnhValidade, setCnhValidade] = useState("");
  const [veiculoMarca, setVeiculoMarca] = useState("");
  const [veiculoModelo, setVeiculoModelo] = useState("");
  const [veiculoPlaca, setVeiculoPlaca] = useState("");
  const [veiculoAno, setVeiculoAno] = useState("");
  const [veiculoAssentos, setVeiculoAssentos] = useState("");
  const [veiculoCor, setVeiculoCor] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRole) throw new Error("Selecione o perfil");

      const created = await api.createUsuario({
        nome,
        email,
        telefone,
        senhaHash: senha,
        cpf,
        status: 1,
        emailVerificado: false,
        telefoneVerificado: false,
        perfis: [selectedRole],
      });

      const userId = created.id;

      if (!userId) {
        throw new Error("Nao foi possivel identificar o usuario criado");
      }

      if (selectedRole === "MOTORISTA") {
        const selectedVehicleType = VEHICLE_TYPES.find((item) => String(item.id) === vehicleType);

        await api.createMotorista({
          usuarioId: userId,
          cnhNumero,
          cnhValidade: new Date(cnhValidade).toISOString(),
          veiculoMarca,
          veiculoModelo,
          veiculoPlaca,
          aprovado: false,
          vehicleTypeId: Number(vehicleType),
          veiculoAno: Number(veiculoAno),
          veiculoAssentos: Number(veiculoAssentos) || selectedVehicleType?.capacity || 4,
          veiculoCor,
          capacidadeVeiculo: Number(veiculoAssentos) || selectedVehicleType?.capacity || 4,
        });
      }

      return { userId, role: selectedRole };
    },
    onSuccess: ({ userId, role }) => {
      saveLocalAccount({ userId, nome, email, senha, role });
      setSession({ userId, role, userName: nome, email });
      queryClient.invalidateQueries({ queryKey: ["motoristas"] });
      queryClient.invalidateQueries({ queryKey: ["viagens"] });
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["presidios"] });
      toast.success("Conta criada com sucesso");
      navigate(role === "MOTORISTA" ? "/my-trips" : "/home");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!nome || !email || !telefone || !cpf || !senha || !selectedRole) {
      toast.error("Preencha os dados obrigatorios");
      return;
    }

    if (selectedRole === "MOTORISTA" && step === "profile") {
      setStep("driver");
      return;
    }

    if (
      selectedRole === "MOTORISTA" &&
      (!cnhNumero || !cnhValidade || !veiculoMarca || !veiculoModelo || !veiculoPlaca || !veiculoAno || !veiculoAssentos || !veiculoCor || !vehicleType)
    ) {
      toast.error("Preencha os dados do motorista");
      return;
    }

    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => {
            if (step === "driver") setStep("profile");
            else navigate("/");
          }}
          className="p-2 -ml-2 rounded-xl hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        {step === "profile" ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">Criar conta</h1>
            <p className="text-muted-foreground mb-6">Preencha seus dados para comecar</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="seu@email.com" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="11999999999" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="00000000000" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 8 caracteres"
                    className="h-12 rounded-xl pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Como deseja usar o app?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedRole("PASSAGEIRO")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === "PASSAGEIRO" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <User className={`w-6 h-6 ${selectedRole === "PASSAGEIRO" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${selectedRole === "PASSAGEIRO" ? "text-primary" : "text-foreground"}`}>Passageiro</span>
                  </button>
                  <button
                    onClick={() => setSelectedRole("MOTORISTA")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === "MOTORISTA" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <Car className={`w-6 h-6 ${selectedRole === "MOTORISTA" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${selectedRole === "MOTORISTA" ? "text-primary" : "text-foreground"}`}>Motorista</span>
                  </button>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={!selectedRole || registerMutation.isPending} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground mt-4">
                {selectedRole === "MOTORISTA" ? "Proximo" : "Criar conta"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">Dados do motorista</h1>
            <p className="text-muted-foreground mb-6">Precisamos de informacoes adicionais</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Numero da CNH</Label>
                <Input value={cnhNumero} onChange={(e) => setCnhNumero(e.target.value)} placeholder="00000000000" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Validade da CNH</Label>
                <Input value={cnhValidade} onChange={(e) => setCnhValidade(e.target.value)} type="date" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Modelo do veiculo</Label>
                <Input value={veiculoModelo} onChange={(e) => setVeiculoModelo(e.target.value)} placeholder="Ex: Fiat Ducato" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Marca do veiculo</Label>
                <Input value={veiculoMarca} onChange={(e) => setVeiculoMarca(e.target.value)} placeholder="Ex: Fiat" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Placa do veiculo</Label>
                <Input value={veiculoPlaca} onChange={(e) => setVeiculoPlaca(e.target.value.toUpperCase())} placeholder="ABC1D23" className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Ano do veiculo</Label>
                  <Input value={veiculoAno} onChange={(e) => setVeiculoAno(e.target.value)} type="number" placeholder="2022" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Cor do veiculo</Label>
                  <Input value={veiculoCor} onChange={(e) => setVeiculoCor(e.target.value)} placeholder="Branco" className="h-12 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo do veiculo</Label>
                <select
                  value={vehicleType}
                  onChange={(e) => {
                    const nextVehicleType = e.target.value;
                    const selectedVehicleType = VEHICLE_TYPES.find((item) => String(item.id) === nextVehicleType);

                    setVehicleType(nextVehicleType);
                    setVeiculoAssentos(selectedVehicleType ? String(selectedVehicleType.capacity) : "");
                  }}
                  className="w-full h-12 rounded-xl bg-muted px-3 text-sm text-foreground border-0 outline-none"
                >
                  <option value="">Selecione o tipo</option>
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade de assentos</Label>
                <Input value={veiculoAssentos} type="number" placeholder="5" className="h-12 rounded-xl" readOnly />
              </div>

              <Button onClick={handleSubmit} disabled={registerMutation.isPending} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground">
                Finalizar cadastro
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
