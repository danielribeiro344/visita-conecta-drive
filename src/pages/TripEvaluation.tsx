import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type ProblemType = 'no_show_passageiro' | 'no_show_motorista' | 'bagagem_divergente' | 'atraso' | 'outro';

const problemLabels: Record<ProblemType, string> = {
  no_show_passageiro: 'Passageiro não apareceu',
  no_show_motorista: 'Motorista não apareceu',
  bagagem_divergente: 'Bagagem divergente do informado',
  atraso: 'Atraso significativo',
  outro: 'Outro',
};

const TripEvaluation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'passenger'; // 'passenger' | 'driver'

  const [rating, setRating] = useState(0);
  const [tripOk, setTripOk] = useState<'yes' | 'no' | ''>('');
  const [onTime, setOnTime] = useState<'yes' | 'no' | ''>('');
  const [baggageOk, setBaggageOk] = useState<'yes' | 'no' | ''>('');
  const [appeared, setAppeared] = useState<'yes' | 'no' | ''>('');
  const [baggageCorrect, setBaggageCorrect] = useState<'yes' | 'no' | ''>('');
  const [hadProblem, setHadProblem] = useState<'yes' | 'no' | ''>('');
  const [problemType, setProblemType] = useState<ProblemType | ''>('');
  const [problemDescription, setProblemDescription] = useState('');

  const showProblemForm = hadProblem === 'yes' || tripOk === 'no' || appeared === 'no' || baggageCorrect === 'no';

  const canSubmit = rating > 0 && (role === 'passenger' ? (tripOk && onTime && baggageOk) : (appeared && baggageCorrect && hadProblem));

  const handleSubmit = () => {
    if (showProblemForm && !problemType) {
      toast.error('Selecione o tipo de problema.');
      return;
    }
    toast.success('Avaliação enviada com sucesso!', {
      description: 'Obrigado pelo feedback. Sua avaliação ajuda a melhorar a plataforma.',
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-4 pb-8 overflow-y-auto space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Avaliar viagem</h1>
        <p className="text-sm text-muted-foreground">Sua avaliação é essencial para a segurança e confiabilidade da plataforma.</p>

        {/* Star rating */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <p className="text-sm font-semibold text-foreground mb-3">
            {role === 'passenger' ? 'Como foi a viagem com o motorista?' : 'Como foi a viagem com o passageiro?'}
          </p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1">
                <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Passenger evaluation questions */}
        {role === 'passenger' && (
          <>
            <EvalQuestion
              question="A viagem aconteceu conforme combinado?"
              value={tripOk}
              onChange={setTripOk}
            />
            <EvalQuestion
              question="O motorista chegou no horário?"
              value={onTime}
              onChange={setOnTime}
            />
            <EvalQuestion
              question="O veículo comportou corretamente a bagagem?"
              value={baggageOk}
              onChange={setBaggageOk}
            />
          </>
        )}

        {/* Driver evaluation questions */}
        {role === 'driver' && (
          <>
            <EvalQuestion
              question="O passageiro compareceu?"
              value={appeared}
              onChange={setAppeared}
            />
            <EvalQuestion
              question="A bagagem informada estava correta?"
              value={baggageCorrect}
              onChange={setBaggageCorrect}
            />
            <EvalQuestion
              question="Houve algum problema durante a viagem?"
              value={hadProblem}
              onChange={setHadProblem}
            />
          </>
        )}

        {/* Problem form */}
        {showProblemForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Registrar problema
            </p>
            <RadioGroup value={problemType} onValueChange={(v) => setProblemType(v as ProblemType)}>
              {(Object.keys(problemLabels) as ProblemType[]).map((key) => (
                <div key={key} className="flex items-center space-x-3 py-1.5">
                  <RadioGroupItem value={key} id={`problem-${key}`} />
                  <Label htmlFor={`problem-${key}`} className="text-sm text-foreground cursor-pointer">{problemLabels[key]}</Label>
                </div>
              ))}
            </RadioGroup>
            {problemType === 'outro' && (
              <Textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Descreva o problema..."
                className="rounded-xl resize-none"
                rows={3}
              />
            )}
            <div className="bg-warning/10 rounded-xl p-3">
              <p className="text-xs text-warning font-medium">
                ⚠️ Problemas reportados podem gerar penalidades: advertência na 1ª ocorrência, suspensão temporária em caso de reincidência.
              </p>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground"
        >
          Enviar avaliação
        </Button>
      </motion.div>
    </div>
  );
};

function EvalQuestion({ question, value, onChange }: {
  question: string;
  value: string;
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card">
      <p className="text-sm font-semibold text-foreground mb-3">{question}</p>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as 'yes' | 'no')} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${question}-yes`} />
          <Label htmlFor={`${question}-yes`} className="text-sm text-foreground cursor-pointer">Sim</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${question}-no`} />
          <Label htmlFor={`${question}-no`} className="text-sm text-foreground cursor-pointer">Não</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default TripEvaluation;
