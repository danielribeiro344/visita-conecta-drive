import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockBookings } from '@/data/mockData';
import { toast } from 'sonner';

const CancelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = mockBookings.find(b => b.id === id);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!booking || !booking.trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Reserva não encontrada</p>
      </div>
    );
  }

  const tripDate = new Date(`${booking.trip.dataSaida}T${booking.trip.horaSaida}`);
  const now = new Date();
  const hoursUntilTrip = (tripDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isWithinPenaltyWindow = hoursUntilTrip < 2;
  const isEmergency = reason === 'emergency';

  const reasons = [
    { value: 'changed_plans', label: 'Mudança de planos' },
    { value: 'found_alternative', label: 'Encontrei outra opção de transporte' },
    { value: 'health', label: 'Problema de saúde' },
    { value: 'emergency', label: 'Emergência (justificativa obrigatória)' },
    { value: 'other', label: 'Outro motivo' },
  ];

  const canCancel = reason && (reason !== 'emergency' && reason !== 'other' || customReason.trim().length > 0);

  const handleCancel = () => {
    if (isWithinPenaltyWindow && !isEmergency) {
      toast.warning('Cancelamento registrado com penalidade.', {
        description: 'Cancelamentos com menos de 2h de antecedência impactam seu score.',
      });
    } else {
      toast.success('Reserva cancelada com sucesso.');
    }
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Cancelar Reserva</h1>

        {/* Time warning */}
        <div className={`rounded-2xl p-4 flex items-start gap-3 ${isWithinPenaltyWindow ? 'bg-destructive/10' : 'bg-success/10'}`}>
          <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${isWithinPenaltyWindow ? 'text-destructive' : 'text-success'}`} />
          <div>
            <p className={`text-sm font-semibold ${isWithinPenaltyWindow ? 'text-destructive' : 'text-success'}`}>
              {isWithinPenaltyWindow
                ? 'Atenção: Menos de 2 horas para a viagem!'
                : `Cancelamento gratuito — faltam ${Math.floor(hoursUntilTrip)}h para a viagem`
              }
            </p>
            <p className={`text-xs mt-1 ${isWithinPenaltyWindow ? 'text-destructive/70' : 'text-success/70'}`}>
              {isWithinPenaltyWindow
                ? 'Cancelar agora gerará um registro no seu histórico e impacto no seu score de reputação, exceto em caso de emergência.'
                : 'Você pode cancelar sem penalidade até 2 horas antes do horário de saída.'
              }
            </p>
          </div>
        </div>

        {/* Trip info */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-sm font-semibold text-foreground">{booking.trip.presidioNome}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(booking.trip.dataSaida).toLocaleDateString('pt-BR')} • {booking.trip.horaSaida} — {booking.quantidadeVagas} vaga(s)
          </p>
        </div>

        {/* Reason selection */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <p className="text-sm font-semibold text-foreground mb-3">Por que deseja cancelar?</p>
          <RadioGroup value={reason} onValueChange={setReason}>
            {reasons.map((r) => (
              <div key={r.value} className="flex items-center space-x-3 py-2">
                <RadioGroupItem value={r.value} id={`cancel-${r.value}`} />
                <Label htmlFor={`cancel-${r.value}`} className="text-sm text-foreground cursor-pointer">{r.label}</Label>
              </div>
            ))}
          </RadioGroup>

          {(reason === 'emergency' || reason === 'other') && (
            <Textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder={reason === 'emergency' ? 'Descreva a emergência...' : 'Descreva o motivo...'}
              className="rounded-xl resize-none mt-3"
              rows={3}
            />
          )}
        </div>

        {/* Penalty info */}
        {isWithinPenaltyWindow && (
          <div className="bg-warning/10 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-warning">Política de penalidades</p>
              <ul className="text-xs text-warning/80 mt-1 space-y-1">
                <li>• 1ª ocorrência: advertência registrada</li>
                <li>• 2ª ocorrência: impacto no score</li>
                <li>• 3ª ocorrência: suspensão temporária da conta</li>
              </ul>
            </div>
          </div>
        )}

        <Button
          onClick={handleCancel}
          disabled={!canCancel}
          className="w-full h-14 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
        >
          {isWithinPenaltyWindow && !isEmergency ? 'Cancelar com penalidade' : 'Confirmar cancelamento'}
        </Button>
      </motion.div>
    </div>
  );
};

export default CancelBooking;
