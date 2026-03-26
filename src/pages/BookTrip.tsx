import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Calendar, Users, MapPin, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { mockTrips } from '@/data/mockData';
import { toast } from 'sonner';
import { BaggageInfo, SacolaSize, SuitcaseSize } from '@/types';

const BookTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = mockTrips.find(t => t.id === id);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'baggage' | 'confirm'>('baggage');

  const [baggage, setBaggage] = useState<BaggageInfo>({
    sacola: 'none',
    mala: 'none',
    mochilas: false,
    mochilasQuantidade: 0,
    itemEspecial: '',
    descricaoAdicional: '',
  });

  if (!trip || trip.status !== 'Ativa') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carona não disponível</p>
      </div>
    );
  }

  const maxQuantity = trip.vagasDisponiveis;
  const total = trip.valor * quantity;

  const canProceed = baggage.descricaoAdicional.trim().length > 0;

  const handleBook = () => {
    toast.success('Reserva realizada com sucesso!', {
      description: `${quantity} vaga(s) reservada(s) — Total: R$ ${total.toFixed(2)}`,
    });
    navigate('/my-bookings');
  };

  const sacolaLabels: Record<SacolaSize, string> = {
    none: 'Não',
    small: 'Sim — pequena',
    medium: 'Sim — média',
    large: 'Sim — grande',
  };

  const malaLabels: Record<SuitcaseSize, string> = {
    none: 'Não',
    small: 'Mala pequena (bagagem de mão)',
    medium: 'Mala média (até 23kg)',
    large: 'Mala grande (+23kg)',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => step === 'confirm' ? setStep('baggage') : navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded-full ${step === 'baggage' ? 'bg-primary' : 'bg-primary'}`} />
            <div className={`h-1 flex-1 rounded-full ${step === 'confirm' ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'baggage' ? (
          <motion.div key="baggage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6 pt-4 pb-8 overflow-y-auto">
            <h1 className="text-2xl font-bold text-foreground mb-1">Bagagem</h1>
            <p className="text-sm text-muted-foreground mb-6">Informe o que você levará na viagem para o motorista se preparar.</p>

            {/* Trip summary */}
            <div className="bg-card rounded-2xl p-4 shadow-card mb-6">
              <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
                <MapPin className="w-4 h-4 text-primary" />
                {trip.presidioNome}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(trip.dataSaida).toLocaleDateString('pt-BR')} • {trip.horaSaida}
              </p>
            </div>

            {/* Sacola */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">🛍️ Você está levando sacola plástica?</p>
              <RadioGroup value={baggage.sacola} onValueChange={(v) => setBaggage({ ...baggage, sacola: v as SacolaSize })}>
                {(Object.keys(sacolaLabels) as SacolaSize[]).map((key) => (
                  <div key={key} className="flex items-center space-x-3 py-1.5">
                    <RadioGroupItem value={key} id={`sacola-${key}`} />
                    <Label htmlFor={`sacola-${key}`} className="text-sm text-foreground cursor-pointer">{sacolaLabels[key]}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Mala */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">🧳 Você está levando mala?</p>
              <RadioGroup value={baggage.mala} onValueChange={(v) => setBaggage({ ...baggage, mala: v as SuitcaseSize })}>
                {(Object.keys(malaLabels) as SuitcaseSize[]).map((key) => (
                  <div key={key} className="flex items-center space-x-3 py-1.5">
                    <RadioGroupItem value={key} id={`mala-${key}`} />
                    <Label htmlFor={`mala-${key}`} className="text-sm text-foreground cursor-pointer">{malaLabels[key]}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Mochilas */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">🎒 Está levando mochila?</p>
              <RadioGroup value={baggage.mochilas ? 'yes' : 'no'} onValueChange={(v) => setBaggage({ ...baggage, mochilas: v === 'yes', mochilasQuantidade: v === 'yes' ? (baggage.mochilasQuantidade || 1) : 0 })}>
                <div className="flex items-center space-x-3 py-1.5">
                  <RadioGroupItem value="no" id="mochilas-no" />
                  <Label htmlFor="mochilas-no" className="text-sm text-foreground cursor-pointer">Não</Label>
                </div>
                <div className="flex items-center space-x-3 py-1.5">
                  <RadioGroupItem value="yes" id="mochilas-yes" />
                  <Label htmlFor="mochilas-yes" className="text-sm text-foreground cursor-pointer">Sim</Label>
                </div>
              </RadioGroup>
              {baggage.mochilas && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="text-xs text-muted-foreground">Quantidade:</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={baggage.mochilasQuantidade || 1}
                      onChange={(e) => setBaggage({ ...baggage, mochilasQuantidade: parseInt(e.target.value) || 1 })}
                      className="w-20 h-9 rounded-xl text-center"
                    />
                  </div>
                  {(baggage.mochilasQuantidade || 0) > 2 && (
                    <div className="bg-warning/10 rounded-xl p-3">
                      <p className="text-xs font-semibold text-warning">⚠️ Atenção: acima de 2 mochilas (até 20L), será cobrado um assento adicional.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Item especial */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">📦 Está transportando algum item especial?</p>
              <p className="text-xs text-muted-foreground mb-2">Ex: caixa, alimento, objetos frágeis, etc.</p>
              <Textarea
                value={baggage.itemEspecial}
                onChange={(e) => setBaggage({ ...baggage, itemEspecial: e.target.value })}
                placeholder="Descreva aqui (opcional)"
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>

            {/* Descrição adicional obrigatória */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
              <p className="text-sm font-semibold text-foreground mb-1">✏️ Descrição adicional <span className="text-destructive">*</span></p>
              <p className="text-xs text-muted-foreground mb-3">Descreva qualquer item adicional que possa ocupar espaço no veículo.</p>
              <Textarea
                value={baggage.descricaoAdicional}
                onChange={(e) => setBaggage({ ...baggage, descricaoAdicional: e.target.value })}
                placeholder="Ex: Levo uma sacola com alimentos e uma bolsa pequena..."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={() => setStep('confirm')}
              disabled={!canProceed}
              className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground"
            >
              Próximo <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        ) : (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 px-6 pt-4 flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-6">Confirmar reserva</h1>

            <div className="bg-card rounded-2xl p-5 shadow-card mb-4 space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{trip.presidioNome}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.dataSaida).toLocaleDateString('pt-BR')} • {trip.horaSaida}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {trip.vagasDisponiveis} vagas
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Motorista: {trip.motoristaNome}</p>
            </div>

            {/* Baggage summary */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Resumo da Bagagem
              </p>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Mochila" value={mochilaLabels[baggage.mochila]} />
                <SummaryRow label="Mala" value={malaLabels[baggage.mala]} />
                <SummaryRow label="Sacolas" value={baggage.sacolas ? `Sim (${baggage.sacolasQuantidade})` : 'Não'} />
                {baggage.itemEspecial && <SummaryRow label="Item especial" value={baggage.itemEspecial} />}
                <SummaryRow label="Descrição" value={baggage.descricaoAdicional} />
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
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

            {/* Total */}
            <div className="bg-accent rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-accent-foreground/60 uppercase tracking-wide">Valor total</p>
                  <p className="text-2xl font-bold text-accent-foreground">R$ {total.toFixed(2)}</p>
                </div>
                <p className="text-sm text-accent-foreground/60">{quantity}x R$ {trip.valor.toFixed(2)}</p>
              </div>
            </div>

            {/* Cancellation policy */}
            <div className="bg-warning/10 rounded-2xl p-4 mb-6">
              <p className="text-xs font-semibold text-warning mb-1">⚠️ Política de cancelamento</p>
              <p className="text-xs text-warning/80">
                Cancelamento gratuito até 2 horas antes do início da viagem. Após esse prazo, o cancelamento gera penalidade no seu perfil.
              </p>
            </div>

            <div className="mt-auto pb-8 safe-bottom">
              <Button onClick={handleBook} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground">
                Confirmar reserva
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default BookTrip;
