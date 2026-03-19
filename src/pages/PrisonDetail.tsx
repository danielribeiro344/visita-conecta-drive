import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, ShieldCheck, ExternalLink, Phone, Mail, MapPin } from 'lucide-react';
import { mockPrisons } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PrisonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prison = mockPrisons.find(p => p.id === id);

  if (!prison) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Presídio não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground flex-1">{prison.nome}</h1>
        </div>
        <p className="text-primary-foreground/60 text-sm">{prison.cidade}, {prison.estado}</p>
        <div className="flex items-center gap-2 mt-3 bg-primary-foreground/10 rounded-xl px-3 py-2 w-fit">
          <Clock className="w-4 h-4 text-primary-foreground/70" />
          <span className="text-sm text-primary-foreground/80">{prison.horarioVisita}</span>
        </div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 mt-6"
      >
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full bg-muted rounded-2xl h-12 p-1">
            <TabsTrigger value="info" className="flex-1 rounded-xl text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Informações
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex-1 rounded-xl text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Regras
            </TabsTrigger>
            <TabsTrigger value="items" className="flex-1 rounded-xl text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Itens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <InfoSection
              icon={<FileText className="w-4 h-4" />}
              title="Documentos exigidos"
              items={prison.requisitosDocumentos}
            />
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(prison.ultimaAtualizacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <a
              href={prison.normasReferencia}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Ver norma oficial
            </a>
          </TabsContent>

          <TabsContent value="rules" className="mt-4">
            <InfoSection
              icon={<ShieldCheck className="w-4 h-4" />}
              title="Regras de vestimenta"
              items={prison.regrasVestimenta}
            />
          </TabsContent>

          <TabsContent value="items" className="mt-4">
            <InfoSection
              icon={<ShieldCheck className="w-4 h-4" />}
              title="Itens permitidos"
              items={prison.itensPermitidos}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

function InfoSection({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrisonDetail;
