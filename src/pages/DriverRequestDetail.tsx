import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, Users, Phone, MessageCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockBookings } from '@/data/mockData';
import { toast } from 'sonner';

const DriverRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = mockBookings.find(b => b.id === id);
  const [status, setStatus] = useState(booking?.status || 'Pendente');

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva não encontrada</p>
      </div>
    );
  }

  const total = booking.trip ? booking.trip.valor * booking.quantidadeVagas : 0;
  const phone = (booking.passageiroTelefone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(
    `Olá, vi sua reserva para a viagem do dia ${booking.trip ? new Date(booking.trip.dataSaida).toLocaleDateString('pt-BR') : ''} para o presídio ${booking.trip?.presidioNome || ''}.`
  )}`;

  const handleApprove = () => {
    setStatus('Confirmada');
    toast.success('Reserva aprovada com sucesso!');
  };

  const handleReject = () => {
    setStatus('Cancelada');
    toast.info('Reserva recusada.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Detalhe da Reserva</h1>

        {/* Passenger data */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-secondary/20 text-secondary text-lg font-bold">
                {(booking.passageiroNome || 'P').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground">{booking.passageiroNome}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {booking.passageiroCidade || 'São Paulo'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-sm font-bold text-foreground">4.7</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">5</p>
              <p className="text-muted-foreground">Viagens realizadas</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Shield className="w-4 h-4 text-secondary" /> Ativo
              </p>
              <p className="text-muted-foreground">Status da conta</p>
            </div>
          </div>
        </div>

        {/* Booking data */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            🎟️ Dados da Reserva
          </h3>
          <InfoRow label="Presídio" value={booking.trip?.presidioNome || ''} />
          <InfoRow label="Data da viagem" value={booking.trip ? new Date(booking.trip.dataSaida).toLocaleDateString('pt-BR') : ''} />
          <InfoRow label="Vagas" value={`${booking.quantidadeVagas}`} />
          <InfoRow label="Valor total" value={`R$ ${total.toFixed(2)}`} />
          <InfoRow label="Status" value={status} />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {status === 'Pendente' && (
            <div className="flex gap-3">
              <Button onClick={handleApprove} className="flex-1 h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> Aprovar
              </Button>
              <Button onClick={handleReject} variant="outline" className="flex-1 h-14 rounded-2xl border-destructive text-destructive font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> Recusar
              </Button>
            </div>
          )}

          {status === 'Confirmada' && (
            <Button asChild className="w-full h-14 rounded-2xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground font-semibold">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> Falar via WhatsApp
              </a>
            </Button>
          )}

          {status !== 'Pendente' && (
            <div className={`rounded-2xl p-4 text-center text-sm font-medium ${
              status === 'Confirmada' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {status === 'Confirmada' ? '✅ Reserva aprovada' : '❌ Reserva recusada'}
            </div>
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
