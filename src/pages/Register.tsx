import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, User, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'profile' | 'driver'>('profile');
  const [selectedRole, setSelectedRole] = useState<'PASSAGEIRO' | 'MOTORISTA' | null>(null);

  const handleSubmit = () => {
    if (selectedRole === 'MOTORISTA' && step === 'profile') {
      setStep('driver');
      return;
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => {
            if (step === 'driver') setStep('profile');
            else navigate('/');
          }}
          className="p-2 -ml-2 rounded-xl hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 px-6 pt-6 pb-8 overflow-y-auto"
      >
        {step === 'profile' ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">Criar conta</h1>
            <p className="text-muted-foreground mb-6">Preencha seus dados para começar</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input placeholder="Seu nome" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="seu@email.com" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(11) 99999-0000" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input placeholder="000.000.000-00" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    className="h-12 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role selection */}
              <div className="space-y-2 pt-2">
                <Label>Como deseja usar o app?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedRole('PASSAGEIRO')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === 'PASSAGEIRO'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <User className={`w-6 h-6 ${selectedRole === 'PASSAGEIRO' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${selectedRole === 'PASSAGEIRO' ? 'text-primary' : 'text-foreground'}`}>
                      Passageiro
                    </span>
                  </button>
                  <button
                    onClick={() => setSelectedRole('MOTORISTA')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === 'MOTORISTA'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <Car className={`w-6 h-6 ${selectedRole === 'MOTORISTA' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${selectedRole === 'MOTORISTA' ? 'text-primary' : 'text-foreground'}`}>
                      Motorista
                    </span>
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedRole}
                className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground mt-4"
              >
                {selectedRole === 'MOTORISTA' ? 'Próximo' : 'Criar conta'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">Dados do motorista</h1>
            <p className="text-muted-foreground mb-6">Precisamos de informações adicionais</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Número da CNH</Label>
                <Input placeholder="00000000000" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Validade da CNH</Label>
                <Input type="date" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Modelo do veículo</Label>
                <Input placeholder="Ex: Fiat Ducato 2022" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Placa do veículo</Label>
                <Input placeholder="ABC-1D23" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Documento do veículo</Label>
                <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground">Toque para enviar foto do documento</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
                <p className="text-sm text-foreground">
                  Seu cadastro ficará com status <strong>"Aguardando aprovação"</strong> até a verificação dos documentos.
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground"
              >
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
