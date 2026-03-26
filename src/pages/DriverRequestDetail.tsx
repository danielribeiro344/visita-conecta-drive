import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, MessageCircle, CheckCircle, XCircle, Shield, Package } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockBookings } from '@/data/mockData';
import { toast } from 'sonner';
import { RejectionReason } from '@/types';

const rejectionReasons: RejectionReason[] = [
  'Excesso de bagagem',
  'Rota incompatível',
  'Horário incompatível',
  'Veículo sem espaço suficiente',
  'Outro',
];

const DriverRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = mockBookings.find(b => b.id === id);
  const [status, setStatus] = useState(booking?.status || 'Pendente');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RejectionReason | ''>('');
  const [otherReason, setOtherReason] = useState('');

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva não encontrada</p>
      </div>
    );
  }

  const total = booking.trip ? booking.trip.valor * booking.quantidadeVagas : 0;

  const handleApprove = () => {
    setStatus('Confirmada');
    toast.success('Reserva aprovada com sucesso!');
  };

  const handleRejectConfirm = () => {
    if (!selectedReason) return;
    if (selectedReason === 'Outro' && !otherReason.trim()) return;

    setStatus('Cancelada');
    setShowRejectModal(false);
    const motivo = selectedReason === 'Outro' ? otherReason : selectedReason;
    toast.info(`Reserva recusada. Motivo: ${motivo}`);
  };

  const canReject = selectedReason && (selectedReason !== 'Outro' || otherReason.trim().length > 0);

  // Mock baggage data (would come from booking in production)
  const mockBaggage = {
    sacola: 'Sim — média',
    mala: 'Não',
    mochilas: 'Sim (2)',
    itemEspecial: 'Sacola com alimentos para visita',
    descricaoAdicional: 'Levo 2 mochilas pequenas com roupas e uma sacola plástica com alimentos.',
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
              <p className="text-muted-foreground">Caronas realizadas</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Shield className="w-4 h-4 text-secondary" /> Ativo
              </p>
              <p className="text-muted-foreground">Status da conta</p>
            </div>
          </div>
        </div>

        {/* Baggage info */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Bagagem do Passageiro
          </h3>
          <InfoRow label="Sacola plástica" value={mockBaggage.sacola} />
          <InfoRow label="Mala" value={mockBaggage.mala} />
          <InfoRow label="Mochilas" value={mockBaggage.mochilas} />
          {mockBaggage.itemEspecial && <InfoRow label="Item especial" value={mockBaggage.itemEspecial} />}
          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-1">Descrição adicional:</p>
            <p className="text-sm text-foreground bg-muted rounded-xl p-3">{mockBaggage.descricaoAdicional}</p>
          </div>
        </div>

        {/* Booking data */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            🎟️ Dados da Reserva
          </h3>
          <InfoRow label="Presídio" value={booking.trip?.presidioNome || ''} />
          <InfoRow label="Data da carona" value={booking.trip ? new Date(booking.trip.dataSaida).toLocaleDateString('pt-BR') : ''} />
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
              <Button onClick={() => setShowRejectModal(true)} variant="outline" className="flex-1 h-14 rounded-2xl border-destructive text-destructive font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> Recusar
              </Button>
            </div>
          )}

          {status === 'Confirmada' && (
            <Button
              onClick={() => navigate(`/chat?contact=${booking.passageiroId}&as=u2`)}
              className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" /> Enviar mensagem
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

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="rounded-2xl mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Motivo da recusa</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Selecione o motivo para recusar esta reserva. O passageiro será notificado.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup value={selectedReason} onValueChange={(v) => setSelectedReason(v as RejectionReason)}>
            {rejectionReasons.map((reason) => (
              <div key={reason} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={reason} id={`reason-${reason}`} />
                <Label htmlFor={`reason-${reason}`} className="text-sm text-foreground cursor-pointer">{reason}</Label>
              </div>
            ))}
          </RadioGroup>
          {selectedReason === 'Outro' && (
            <Textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Descreva o motivo..."
              className="rounded-xl resize-none mt-2"
              rows={3}
            />
          )}
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowRejectModal(false)} className="flex-1 rounded-xl">
              Voltar
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={!canReject}
              className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Confirmar recusa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium text-right max-w-[55%]">{value}</span>
    </div>
  );
}

export default DriverRequestDetail;
