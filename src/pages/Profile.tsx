import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Shield, Car, LogOut, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockUser, mockDriver, mockDriverDetail } from '@/data/mockData';
import BottomNav from '@/components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDriver = searchParams.get('role') === 'motorista';
  const user = isDriver ? mockDriver : mockUser;
  const detail = isDriver ? mockDriverDetail : null;

  const maskedCpf = user.cpf.replace(/(\d{3})\.\d{3}\.\d{3}(-\d{2})/, '$1.***.***$2');
  const maskedPlaca = detail ? detail.veiculoPlaca.replace(/(.{3}).(.{4})/, '$1-****') : '';
  const maskedCnh = detail ? detail.cnhNumero.replace(/^(.{3}).*(.{2})$/, '$1*****$2') : '';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-6 pt-12 pb-10 rounded-b-3xl text-center relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 p-2 rounded-xl text-primary-foreground/80 hover:bg-primary-foreground/10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-primary-foreground/20">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
            {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-bold text-primary-foreground">{user.nome}</h1>
        <p className="text-primary-foreground/60 text-sm">{user.cidade || 'São Paulo'}</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-primary-foreground">{user.totalViagens || 0}</p>
            <p className="text-[10px] text-primary-foreground/60 uppercase">Caronas</p>
          </div>
          <div className="w-px h-8 bg-primary-foreground/20" />
          <div className="text-center flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <p className="text-lg font-bold text-primary-foreground">{user.avaliacaoMedia || '—'}</p>
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
          <h2 className="text-sm font-semibold text-foreground">Informações pessoais</h2>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Telefone" value={user.telefone} />
          <InfoRow label="CPF" value={maskedCpf} />
          <InfoRow label="Status" value={user.status} />
        </div>

        {isDriver && detail && (
          <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Veículo</h2>
            </div>
            <InfoRow label="Modelo" value={detail.veiculoModelo} />
            <InfoRow label="Placa" value={maskedPlaca} />
            <InfoRow label="Capacidade" value={`${detail.capacidadeVeiculo} passageiros`} />
            <InfoRow label="CNH" value={maskedCnh} />
            <InfoRow label="Aprovação" value={detail.aprovado ? '✅ Aprovado' : '⏳ Pendente'} />
          </div>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between h-12 rounded-2xl" onClick={() => {}}>
            <span className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Editar perfil</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>

          {isDriver && (
            <Button variant="outline" className="w-full justify-between h-12 rounded-2xl" onClick={() => navigate('/my-trips')}>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ver minhas caronas</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}

          <Button variant="outline" className="w-full justify-between h-12 rounded-2xl text-destructive hover:text-destructive" onClick={() => navigate('/')}>
            <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Sair</span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="ghost" className="w-full h-10 text-xs text-muted-foreground" onClick={() => {}}>
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir conta
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
