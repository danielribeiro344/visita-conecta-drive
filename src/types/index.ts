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
}

export interface DriverDetail {
  userId: string;
  cnhNumero: string;
  cnhValidade: string;
  veiculoModelo: string;
  veiculoPlaca: string;
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
  status: BookingStatus;
  quantidadeVagas: number;
  dataReserva: string;
  trip?: Trip;
}
