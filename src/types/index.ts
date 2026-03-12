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
  vehicleTypeId?: number;
  veiculoMarca?: string;
  veiculoAno?: number;
  veiculoAssentos?: number;
  veiculoCor?: string;
  capacidadeVeiculo: number;
  aprovado: boolean;
}

export interface Prison {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderNome: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}
