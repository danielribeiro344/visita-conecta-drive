import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Phone, MapPin, FileText, AlertTriangle, Users, HeartPulse, Shield, Scale, Building2, Search, Mail } from 'lucide-react';

const supportContent: Record<string, {
  title: string;
  icon: any;
  color: string;
  sections: { title: string; items: string[] }[];
  links: { label: string; url: string }[];
  contacts?: { label: string; value: string; type: 'phone' | 'email' | 'link' }[];
}> = {
  seap: {
    title: 'SEAP RJ — Visitas e Presídios',
    icon: MapPin,
    color: 'bg-destructive/10 text-destructive',
    sections: [
      {
        title: '📍 O que a SEAP oferece',
        items: [
          'Lista completa de unidades prisionais do RJ',
          'Dias e horários de visita por presídio',
          'Regras de vestimenta e itens permitidos',
          'Documentos exigidos para visitação',
          'Cadastro de visitante',
        ],
      },
      {
        title: '🔎 Localizar preso na SEAP',
        items: [
          'Consulte em qual presídio a pessoa está custodiada',
          'Evite viajar para o presídio errado',
          'Atualizações de transferências entre unidades',
          'Acesse o sistema de localização pelo site oficial',
        ],
      },
      {
        title: '📄 Documentos para visita',
        items: [
          'RG original (obrigatório)',
          'Carteirinha de visitante emitida pela SEAP',
          'Comprovante de vínculo familiar (certidão de casamento, nascimento, etc)',
          'Comprovante de residência atualizado',
        ],
      },
    ],
    links: [
      { label: 'Site oficial da SEAP RJ', url: 'https://www.seap.rj.gov.br' },
      { label: 'Localizar preso', url: 'https://www.seap.rj.gov.br/localizar-preso' },
      { label: 'Cadastro de visitante', url: 'https://www.seap.rj.gov.br/cadastro-visitante' },
    ],
    contacts: [
      { label: 'Ouvidoria SEAP', value: '(21) 2332-4500', type: 'phone' },
      { label: 'E-mail SEAP', value: 'ouvidoria@seap.rj.gov.br', type: 'email' },
    ],
  },
  tjrj: {
    title: 'Consulta de Processo — TJRJ',
    icon: Scale,
    color: 'bg-destructive/10 text-destructive',
    sections: [
      {
        title: '📄 O que você pode consultar',
        items: [
          'Progressão de regime (fechado → semiaberto → aberto)',
          'Audiências marcadas e datas',
          'Alvará de soltura',
          'Mudança de regime',
          'Decisões judiciais recentes',
          'Status do processo criminal',
        ],
      },
      {
        title: '🔎 Como consultar',
        items: [
          'Acesse o portal do TJRJ',
          'Busque pelo número do processo ou nome do réu',
          'Consulta gratuita e pública',
          'Acompanhe movimentações processuais em tempo real',
        ],
      },
      {
        title: '⚖️ Defensoria Pública',
        items: [
          'Se não tem advogado, procure a Defensoria Pública',
          'Atendimento gratuito para famílias de baixa renda',
          'A Defensoria pode acompanhar o processo criminal',
          'Solicite informações sobre progressão de regime',
        ],
      },
    ],
    links: [
      { label: 'Portal do TJRJ — Consulta processual', url: 'https://www3.tjrj.jus.br/consultaprocessual' },
      { label: 'Defensoria Pública RJ', url: 'https://www.defensoria.rj.def.br' },
    ],
    contacts: [
      { label: 'TJRJ Central', value: '(21) 3133-3000', type: 'phone' },
      { label: 'Defensoria Pública', value: '(21) 2332-6000', type: 'phone' },
    ],
  },
  mprj: {
    title: 'Denunciar Abuso — MPRJ',
    icon: AlertTriangle,
    color: 'bg-warning/10 text-warning',
    sections: [
      {
        title: '🚨 O que pode ser denunciado',
        items: [
          'Agressão física ou psicológica contra preso',
          'Falta de atendimento médico',
          'Corrupção dentro do sistema prisional',
          'Cobrança ilegal (extorsão)',
          'Violação de direitos do preso',
          'Superlotação e condições desumanas',
          'Impedimento ilegal de visitas',
        ],
      },
      {
        title: '📝 Como denunciar',
        items: [
          'Acesse a Ouvidoria do MPRJ',
          'Denúncias podem ser anônimas',
          'Relate com o máximo de detalhes possível',
          'Informe nome da unidade, data e descrição do fato',
          'Guarde protocolo da denúncia para acompanhamento',
        ],
      },
    ],
    links: [
      { label: 'Ouvidoria do MPRJ', url: 'https://www.mprj.mp.br/comunicacao/ouvidoria' },
      { label: 'Denúncia online', url: 'https://www.mprj.mp.br/servicos/denuncia' },
    ],
    contacts: [
      { label: 'Ouvidoria MPRJ', value: '(21) 2550-9050', type: 'phone' },
      { label: 'E-mail denúncias', value: 'ouvidoria@mprj.mp.br', type: 'email' },
    ],
  },
  cras: {
    title: 'Assistência Social — CRAS',
    icon: Users,
    color: 'bg-info/10 text-info',
    sections: [
      {
        title: '👨‍👩‍👧 Serviços disponíveis',
        items: [
          'Cadastro Único para programas sociais',
          'Bolsa Família',
          'Auxílio social emergencial',
          'Apoio psicológico para familiares',
          'Assistência familiar e orientação',
          'Encaminhamento para emprego',
          'Apoio a crianças e adolescentes',
        ],
      },
      {
        title: '📍 Como encontrar o CRAS mais próximo',
        items: [
          'Procure pelo CRAS do seu bairro ou município',
          'Leve RG, CPF e comprovante de residência',
          'O atendimento é gratuito',
          'Prioridade para famílias em situação de vulnerabilidade',
        ],
      },
      {
        title: '👩 Quem pode ser atendido',
        items: [
          'Mães de pessoas presas',
          'Avós e outros familiares responsáveis',
          'Filhos de pessoas no sistema prisional',
          'Cônjuges e companheiros(as)',
          'Qualquer familiar em situação de vulnerabilidade social',
        ],
      },
    ],
    links: [
      { label: 'Localizar CRAS mais próximo', url: 'https://aplicacoes.mds.gov.br/sagi/mops' },
      { label: 'Cadastro Único', url: 'https://www.gov.br/pt-br/servicos/inscrever-no-cadastro-unico' },
    ],
    contacts: [
      { label: 'Central de Atendimento', value: '(21) 2976-1530', type: 'phone' },
    ],
  },
  pnaisp: {
    title: 'Saúde no Sistema Prisional — PNAISP',
    icon: HeartPulse,
    color: 'bg-secondary/10 text-secondary',
    sections: [
      {
        title: '🏥 Direitos de saúde do preso',
        items: [
          'Atendimento médico dentro da unidade',
          'Odontologia',
          'Fornecimento de medicamentos essenciais',
          'Atendimento de saúde mental',
          'Atendimento a gestantes e lactantes',
          'Vacinação e prevenção de doenças',
        ],
      },
      {
        title: '📋 Como solicitar atendimento',
        items: [
          'O familiar pode solicitar à direção da unidade',
          'Em caso de emergência, a unidade deve providenciar',
          'Registre por escrito qualquer solicitação',
          'Em caso de negativa, denuncie ao MPRJ ou Defensoria',
        ],
      },
      {
        title: '🚨 Quando denunciar falta de atendimento',
        items: [
          'Preso com doença grave sem tratamento',
          'Falta de medicamentos prescritos',
          'Negativa de atendimento médico',
          'Condições insalubres que afetam a saúde',
          'Falta de atendimento a gestantes',
        ],
      },
    ],
    links: [
      { label: 'PNAISP — Ministério da Saúde', url: 'https://www.gov.br/saude/pt-br/composicao/saps/pnaisp' },
      { label: 'Denunciar ao MPRJ', url: 'https://www.mprj.mp.br/servicos/denuncia' },
    ],
    contacts: [
      { label: 'Disque Saúde', value: '136', type: 'phone' },
    ],
  },
};

const SupportDetail = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const content = type ? supportContent[type] : null;

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Serviço não encontrado</p>
      </div>
    );
  }

  const IconComponent = content.icon;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground flex-1">{content.title}</h1>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${content.color}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {content.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl p-4 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">🔗 Links úteis</h3>
          <div className="space-y-2">
            {content.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Contacts */}
        {content.contacts && content.contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-4 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">📞 Contatos</h3>
            <div className="space-y-2">
              {content.contacts.map((contact, i) => (
                <a
                  key={i}
                  href={contact.type === 'phone' ? `tel:${contact.value.replace(/\D/g, '')}` : contact.type === 'email' ? `mailto:${contact.value}` : contact.value}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  {contact.type === 'phone' ? <Phone className="w-3.5 h-3.5 text-primary shrink-0" /> : <Mail className="w-3.5 h-3.5 text-primary shrink-0" />}
                  <span className="font-medium">{contact.label}:</span>
                  <span className="text-primary">{contact.value}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupportDetail;
