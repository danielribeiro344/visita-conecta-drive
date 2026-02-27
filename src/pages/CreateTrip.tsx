import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockPrisons } from '@/data/mockData';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [prison, setPrison] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');

  const handleCreate = () => {
    toast.success('Viagem criada com sucesso!');
    navigate('/my-trips');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-4"
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Criar viagem</h1>
        <p className="text-muted-foreground text-sm mb-6">Preencha os dados da viagem</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Presídio</Label>
            <select
              value={prison}
              onChange={(e) => setPrison(e.target.value)}
              className="w-full h-12 rounded-xl bg-muted px-3 text-sm text-foreground border-0 outline-none"
            >
              <option value="">Selecione o presídio</option>
              {mockPrisons.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data de saída</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Valor por passageiro</Label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Total de vagas</Label>
              <Input
                type="number"
                placeholder="0"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground mt-4"
          >
            Criar viagem
          </Button>
        </div>
      </motion.div>

      <BottomNav active="create" isDriver />
    </div>
  );
};

export default CreateTrip;
