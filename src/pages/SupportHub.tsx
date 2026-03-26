import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, FileText, AlertTriangle, Users, HeartPulse, Phone, Mail, ExternalLink, ChevronRight, Building2, Search, Shield, MessageCircle } from 'lucide-react';
import { seapUnits } from '@/data/mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import BottomNav from '@/components/BottomNav';

const services = [
  {
    id: 'seap',
    icon: MapPin,
    color: 'bg-destructive/10 text-destructive',
    title: 'SEAP RJ — Visitas e Presídios',
    description: 'Dias de visita, regras, localização do preso, documentos exigidos',
    path: '/support/seap',
  },
  {
    id: 'tjrj',
    icon: FileText,
    color: 'bg-destructive/10 text-destructive',
    title: 'Consulta de Processo (TJRJ)',
    description: 'Progressão de regime, audiências, alvará de soltura, decisões judiciais',
    path: '/support/tjrj',
  },
  {
    id: 'mprj',
    icon: AlertTriangle,
    color: 'bg-warning/10 text-warning',
    title: 'Denunciar Abuso (MPRJ)',
    description: 'Agressão, falta de atendimento médico, corrupção, cobrança ilegal',
    path: '/support/mprj',
  },
  {
    id: 'cras',
    icon: Users,
    color: 'bg-info/10 text-info',
    title: 'Assistência Social (CRAS)',
    description: 'Cadastro Único, Bolsa Família, apoio psicológico, assistência familiar',
    path: '/support/cras',
  },
  {
    id: 'pnaisp',
    icon: HeartPulse,
    color: 'bg-secondary/10 text-secondary',
    title: 'Saúde no Sistema Prisional (PNAISP)',
    description: 'Atendimento médico, odontologia, medicamentos, saúde mental',
    path: '/support/pnaisp',
  },
];

const SupportHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground">Apoio ao Familiar</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm">
          Serviços essenciais para familiares de pessoas no sistema prisional do RJ
        </p>
      </div>

      <div className="px-6 mt-6 space-y-3">
        {services.map((svc, i) => (
          <motion.button
            key={svc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(svc.path)}
            className="w-full text-left bg-card rounded-2xl p-4 shadow-card hover:shadow-elevated transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${svc.color}`}>
                <svc.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{svc.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{svc.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-3" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* SEAP Contact Units */}
      <div className="px-6 mt-8">
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Unidades SEAP — Contatos
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {seapUnits.map((unit) => (
            <AccordionItem key={unit.id} value={unit.id} className="border-0">
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{unit.sigla} — {unit.nome}</p>
                    <p className="text-xs text-muted-foreground">{unit.cidade}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{unit.endereco}, {unit.cidade} — CEP {unit.cep}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Regime: {unit.regime}
                    </div>
                    <div className="flex gap-3 mt-2">
                      <a href={`tel:${unit.telefone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        {unit.telefone}
                      </a>
                      <a href={`mailto:${unit.email}`} className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        E-mail
                      </a>
                    </div>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <BottomNav active="support" />
    </div>
  );
};

export default SupportHub;
