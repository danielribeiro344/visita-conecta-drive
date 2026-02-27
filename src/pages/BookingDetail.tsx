import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Shield, Car, Calendar, MapPin, Users, MessageCircle, XCircle, Check, Clock, Flag } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockBookings, mockDriver, mockDriverDetail } from '@/data/mockData';
import { toast } from 'sonner';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = mockBookings.find(b => b.id === id);
  const [status, setStatus] = useState(booking?.status || 'Pendente');

  if (!booking || !booking.trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva não encontrada</p>
      </div>
    );
  }

  const trip = booking.trip;
  const total = trip.valor * booking.quantidadeVagas;
  const driverPhone = mockDriver.telefone.replace(/\D/g, '');
  const maskedPlaca = mockDriverDetail.veiculoPlaca.replace(/(.{3}).(.*)/, '$1-****');

  const whatsappUrl = `https://wa.me/55${driverPhone}?text=${encodeURIComponent(
    `Olá, sou passageiro(a) da viagem para o presídio ${trip.presidioNome} no dia ${new Date(trip.dataSaida).toLocaleDateString('pt-BR')}. Gostaria de confirmar os detalhes.`
  )}`;

  const handleCancel = () => {
    setStatus('Cancelada');
    toast.info('Reserva cancelada.');
  };

  const timelineSteps = [
    { label: 'Reserva solicitada', done: true, icon: Clock },
    { label: 'Reserva aprovada', done: status === 'Confirmada', icon: Check },
    { label: 'Viagem realizada', done: trip.status === 'Finalizada', icon: Flag },
    { label: 'Avaliação', done: false, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Detalhe da Viagem</h1>

        {/* Driver card */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">CS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{mockDriver.nome}</h2>
                {mockDriverDetail.aprovado && <Shield className="w-4 h-4 text-secondary" />}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-xs font-semibold text-foreground">{mockDriver.avaliacaoMedia}</span>
                <span className="text-xs text-muted-foreground ml-1">• {mockDriver.totalViagens} viagens</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
            <Car className="w-4 h-4 text-primary" />
            <span>{mockDriverDetail.veiculoModelo}</span>
            <span className="ml-auto font-medium text-foreground">{maskedPlaca}</span>
          </div>
        </div>

        {/* Trip data */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground">📍 Dados da Viagem</h3>
          <InfoRow icon={MapPin} label="Presídio" value={trip.presidioNome} />
          <InfoRow icon={Calendar} label="Data e hora" value={`${new Date(trip.dataSaida).toLocaleDateString('pt-BR')} • ${trip.horaSaida}`} />
          <InfoRow icon={Users} label="Vagas reservadas" value={`${booking.quantidadeVagas}`} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">Valor total</span>
            <span className="text-base font-bold text-primary">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Linha do tempo</h3>
          <div className="space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.done ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-0.5 h-6 ${step.done ? 'bg-secondary' : 'bg-border'}`} />
                  )}
                </div>
                <p className={`text-sm pt-1.5 ${step.done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {status === 'Confirmada' && (
            <Button asChild className="w-full h-14 rounded-2xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground font-semibold">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> Falar com Motorista via WhatsApp
              </a>
            </Button>
          )}

          {status === 'Pendente' && (
            <div className="bg-warning/10 text-warning rounded-2xl p-4 text-center text-sm font-medium">
              ⏳ Aguardando aprovação do motorista
            </div>
          )}

          {(status === 'Pendente' || status === 'Confirmada') && (
            <Button onClick={handleCancel} variant="outline" className="w-full h-12 rounded-2xl border-destructive text-destructive font-semibold">
              <XCircle className="w-4 h-4 mr-2" /> Cancelar Reserva
            </Button>
          )}

          {status === 'Cancelada' && (
            <div className="bg-destructive/10 text-destructive rounded-2xl p-4 text-center text-sm font-medium">
              ❌ Reserva cancelada
            </div>
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
