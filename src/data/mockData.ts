import { Prison, Trip, Booking, User, DriverDetail } from '@/types';

export const mockUser: User = {
  id: 'u1',
  nome: 'Maria Silva',
  email: 'maria@email.com',
  telefone: '(11) 99999-0000',
  cpf: '123.456.789-00',
  status: 'Ativo',
  perfis: ['PASSAGEIRO'],
  cidade: 'São Paulo',
  totalViagens: 5,
  avaliacaoMedia: 4.7,
};

export const mockDriver: User = {
  id: 'u2',
  nome: 'Carlos Santos',
  email: 'carlos@email.com',
  telefone: '(11) 98888-0000',
  cpf: '987.654.321-00',
  status: 'Ativo',
  perfis: ['MOTORISTA'],
  cidade: 'São Paulo',
  totalViagens: 32,
  avaliacaoMedia: 4.9,
};

export const mockDriverDetail: DriverDetail = {
  userId: 'u2',
  cnhNumero: '12345678900',
  cnhValidade: '2027-05-15',
  veiculoModelo: 'Fiat Ducato 2022',
  veiculoPlaca: 'ABC-1D23',
  aprovado: true,
};

export const mockPrisons: Prison[] = [
  {
    id: 'p1',
    nome: 'Penitenciária de Tremembé',
    cidade: 'Tremembé',
    estado: 'SP',
    horarioVisita: 'Sábados e Domingos — 8h às 16h',
    requisitosDocumentos: ['RG original', 'Carteirinha de visitante', 'Comprovante de vínculo'],
    itensPermitidos: ['Alimentos em embalagem transparente', 'Água (garrafa transparente até 500ml)', 'Roupas íntimas (brancas, 3 peças)'],
    regrasVestimenta: ['Roupas brancas ou claras', 'Sem decotes', 'Sem shorts curtos', 'Sem roupas rasgadas'],
    normasReferencia: 'https://www.sap.sp.gov.br',
    ultimaAtualizacao: '2026-02-10',
  },
  {
    id: 'p2',
    nome: 'CDP de Guarulhos',
    cidade: 'Guarulhos',
    estado: 'SP',
    horarioVisita: 'Quintas e Domingos — 9h às 15h',
    requisitosDocumentos: ['RG original', 'Carteirinha de visitante atualizada'],
    itensPermitidos: ['Alimentos sem embalagem metálica', 'Água (garrafa transparente)', 'Kit higiene pessoal básico'],
    regrasVestimenta: ['Roupas brancas', 'Sem sapato de salto', 'Sem bijuterias metálicas'],
    normasReferencia: 'https://www.sap.sp.gov.br',
    ultimaAtualizacao: '2026-01-28',
  },
  {
    id: 'p3',
    nome: 'Penitenciária de Franco da Rocha',
    cidade: 'Franco da Rocha',
    estado: 'SP',
    horarioVisita: 'Sábados — 8h às 16h',
    requisitosDocumentos: ['RG original', 'Carteirinha de visitante', 'Comprovante de residência'],
    itensPermitidos: ['Alimentos em sacolas transparentes', 'Medicamentos com receita'],
    regrasVestimenta: ['Roupas claras', 'Sem estampas chamativas', 'Sem boné'],
    normasReferencia: 'https://www.sap.sp.gov.br',
    ultimaAtualizacao: '2026-02-20',
  },
];

export const mockTrips: Trip[] = [
  {
    id: 't1',
    motoristaId: 'u2',
    motoristaNome: 'Carlos Santos',
    presidioId: 'p1',
    presidioNome: 'Penitenciária de Tremembé',
    dataSaida: '2026-03-08',
    horaSaida: '05:00',
    valor: 65.0,
    vagasTotais: 8,
    vagasDisponiveis: 3,
    status: 'Ativa',
  },
  {
    id: 't2',
    motoristaId: 'u2',
    motoristaNome: 'Carlos Santos',
    presidioId: 'p2',
    presidioNome: 'CDP de Guarulhos',
    dataSaida: '2026-03-06',
    horaSaida: '06:30',
    valor: 40.0,
    vagasTotais: 6,
    vagasDisponiveis: 0,
    status: 'Lotada',
  },
  {
    id: 't3',
    motoristaId: 'u3',
    motoristaNome: 'Roberto Lima',
    presidioId: 'p1',
    presidioNome: 'Penitenciária de Tremembé',
    dataSaida: '2026-03-08',
    horaSaida: '04:30',
    valor: 70.0,
    vagasTotais: 10,
    vagasDisponiveis: 6,
    status: 'Ativa',
  },
  {
    id: 't4',
    motoristaId: 'u2',
    motoristaNome: 'Carlos Santos',
    presidioId: 'p3',
    presidioNome: 'Penitenciária de Franco da Rocha',
    dataSaida: '2026-03-01',
    horaSaida: '05:30',
    valor: 35.0,
    vagasTotais: 8,
    vagasDisponiveis: 8,
    status: 'Finalizada',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    viagemId: 't1',
    passageiroId: 'u1',
    passageiroNome: 'Maria Silva',
    passageiroTelefone: '(11) 99999-0000',
    passageiroCidade: 'São Paulo',
    status: 'Confirmada',
    quantidadeVagas: 2,
    dataReserva: '2026-02-25',
    trip: mockTrips[0],
  },
  {
    id: 'b2',
    viagemId: 't4',
    passageiroId: 'u1',
    passageiroNome: 'Maria Silva',
    passageiroTelefone: '(11) 99999-0000',
    passageiroCidade: 'São Paulo',
    status: 'Confirmada',
    quantidadeVagas: 1,
    dataReserva: '2026-02-20',
    trip: mockTrips[3],
  },
  {
    id: 'b3',
    viagemId: 't1',
    passageiroId: 'u4',
    passageiroNome: 'Ana Oliveira',
    passageiroTelefone: '(11) 97777-0000',
    passageiroCidade: 'Guarulhos',
    status: 'Pendente',
    quantidadeVagas: 1,
    dataReserva: '2026-02-27',
    trip: mockTrips[0],
  },
  {
    id: 'b4',
    viagemId: 't1',
    passageiroId: 'u5',
    passageiroNome: 'João Pereira',
    passageiroTelefone: '(11) 96666-0000',
    passageiroCidade: 'Osasco',
    status: 'Pendente',
    quantidadeVagas: 2,
    dataReserva: '2026-02-27',
    trip: mockTrips[0],
  },
];

export interface Notification {
  id: string;
  tipo: 'reserva_nova' | 'reserva_aprovada' | 'reserva_recusada' | 'viagem_cancelada' | 'cancelamento_passageiro';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

export const mockNotificationsPassenger: Notification[] = [
  {
    id: 'n1',
    tipo: 'reserva_aprovada',
    titulo: 'Reserva aprovada!',
    mensagem: 'Sua reserva para Penitenciária de Tremembé em 08/03 foi aprovada pelo motorista Carlos Santos.',
    data: '2026-02-26T14:30:00',
    lida: false,
  },
  {
    id: 'n2',
    tipo: 'reserva_recusada',
    titulo: 'Reserva recusada',
    mensagem: 'Sua reserva para CDP de Guarulhos em 06/03 foi recusada pelo motorista.',
    data: '2026-02-25T10:00:00',
    lida: true,
  },
];

export const mockNotificationsDriver: Notification[] = [
  {
    id: 'n3',
    tipo: 'reserva_nova',
    titulo: 'Nova solicitação de reserva',
    mensagem: 'Ana Oliveira solicitou 1 vaga para a viagem de 08/03 (Tremembé).',
    data: '2026-02-27T09:00:00',
    lida: false,
  },
  {
    id: 'n4',
    tipo: 'reserva_nova',
    titulo: 'Nova solicitação de reserva',
    mensagem: 'João Pereira solicitou 2 vagas para a viagem de 08/03 (Tremembé).',
    data: '2026-02-27T08:15:00',
    lida: false,
  },
  {
    id: 'n5',
    tipo: 'cancelamento_passageiro',
    titulo: 'Cancelamento de passageiro',
    mensagem: 'Roberto Lima cancelou a reserva para a viagem de 01/03.',
    data: '2026-02-24T16:00:00',
    lida: true,
  },
];
