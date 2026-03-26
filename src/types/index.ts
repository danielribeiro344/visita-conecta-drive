export type UserRole = 'ADMIN' | 'PASSAGEIRO' | 'MOTORISTA' | 'MODERADOR';

export type UserStatus = 'Ativo' | 'Bloqueado' | 'Pendente';
export type TripStatus = 'Ativa' | 'Lotada' | 'Cancelada' | 'Finalizada';
export type BookingStatus = 'Pendente' | 'Confirmada' | 'Cancelada';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  status: UserStatus;
  perfis: UserRole[];
  avatarUrl?: string;
  cidade?: string;
  totalViagens?: number;
  avaliacaoMedia?: number;
}

export interface DriverDetail {
  userId: string;
  cnhNumero: string;
  cnhValidade: string;
  veiculoModelo: string;
  veiculoPlaca: string;
  capacidadeVeiculo: number;
  aprovado: boolean;
}

export interface Prison {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  horarioVisita: string;
  requisitosDocumentos: string[];
  itensPermitidos: string[];
  regrasVestimenta: string[];
  normasReferencia: string;
  ultimaAtualizacao: string;
}

export interface Trip {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  presidioId: string;
  presidioNome: string;
  dataSaida: string;
  horaSaida: string;
  valor: number;
  vagasTotais: number;
  vagasDisponiveis: number;
  status: TripStatus;
}

export interface Booking {
  id: string;
  viagemId: string;
  passageiroId: string;
  passageiroNome?: string;
  passageiroTelefone?: string;
  passageiroCidade?: string;
  status: BookingStatus;
  quantidadeVagas: number;
  dataReserva: string;
  trip?: Trip;
}

export type SacolaSize = 'none' | 'small' | 'medium' | 'large';
export type SuitcaseSize = 'none' | 'small' | 'medium' | 'large';

export interface BaggageInfo {
  sacola: SacolaSize;
  mala: SuitcaseSize;
  mochilas: boolean;
  mochilasQuantidade?: number;
  itemEspecial?: string;
  descricaoAdicional: string;
}

export type RejectionReason = 
  | 'Excesso de bagagem'
  | 'Rota incompatível'
  | 'Horário incompatível'
  | 'Veículo sem espaço suficiente'
  | 'Outro';

export type PenaltyType = 'no_show' | 'bagagem_divergente' | 'atraso' | 'outro';
export type StrikeLevel = 0 | 1 | 2 | 3;

export interface ChatMessage {
  id: string;
  senderId: string;
  senderNome: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}
