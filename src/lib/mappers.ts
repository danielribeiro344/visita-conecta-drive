import { Booking, DriverDetail, Prison, Trip, User } from "@/types";
import { ApiMotorista, ApiPresidio, ApiReserva, ApiUsuario, ApiViagem, api, normalizeReservaStatus, normalizeTripStatus, normalizeUsuarioStatus } from "@/lib/api";

export function toUser(usuario: ApiUsuario): User {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    cpf: usuario.cpf,
    status: normalizeUsuarioStatus(usuario.status),
    perfis: usuario.perfis ?? ["PASSAGEIRO"],
  };
}

export function toDriverDetail(motorista: ApiMotorista): DriverDetail {
  const capacidadeVeiculo = motorista.veiculoAssentos ?? motorista.capacidadeVeiculo ?? 4;

  return {
    userId: motorista.usuarioId,
    cnhNumero: motorista.cnhNumero,
    cnhValidade: motorista.cnhValidade,
    veiculoModelo: motorista.veiculoModelo,
    veiculoPlaca: motorista.veiculoPlaca,
    vehicleTypeId: motorista.vehicleTypeId,
    veiculoMarca: motorista.veiculoMarca,
    veiculoAno: motorista.veiculoAno,
    veiculoAssentos: motorista.veiculoAssentos ?? capacidadeVeiculo,
    veiculoCor: motorista.veiculoCor,
    capacidadeVeiculo,
    aprovado: Boolean(motorista.aprovado),
  };
}

export function toPrison(presidio: ApiPresidio): Prison {
  return {
    id: presidio.id,
    nome: presidio.nome,
    cidade: presidio.cidade,
    estado: presidio.estado,
    horarioVisita: Array.isArray(presidio.horarioVisita)
      ? presidio.horarioVisita.join(", ")
      : presidio.horarioVisita,
    requisitosDocumentos: api.parseJsonArray(presidio.requisitosDocumentos),
    itensPermitidos: api.parseJsonArray(presidio.itensPermitidos),
    regrasVestimenta: api.parseJsonArray(presidio.regrasVestimenta),
    normasReferencia: presidio.normasReferencia ?? "",
    ultimaAtualizacao: presidio.ultimaAtualizacao ?? new Date().toISOString(),
  };
}

export function toTrip(
  viagem: ApiViagem,
  usersById: Map<string, ApiUsuario>,
  prisonsById: Map<string, ApiPresidio>,
): Trip {
  const data = new Date(viagem.dataSaida);
  const vagasDisponiveis = viagem.vagasDisponiveis ?? viagem.vagasTotais;

  return {
    id: viagem.id,
    motoristaId: viagem.motoristaId,
    motoristaNome: usersById.get(viagem.motoristaId)?.nome ?? "Motorista",
    presidioId: viagem.presidioId,
    presidioNome: prisonsById.get(viagem.presidioId)?.nome ?? "Presidio",
    dataSaida: viagem.dataSaida,
    horaSaida: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    valor: Number(viagem.valor),
    vagasTotais: Number(viagem.vagasTotais),
    vagasDisponiveis,
    status: normalizeTripStatus(viagem.status, vagasDisponiveis),
  };
}

export function toBooking(reserva: ApiReserva, tripMap: Map<string, Trip>, usersById: Map<string, ApiUsuario>): Booking {
  const user = usersById.get(reserva.passageiroId);

  return {
    id: reserva.id,
    viagemId: reserva.viagemId,
    passageiroId: reserva.passageiroId,
    passageiroNome: user?.nome ?? "Passageiro",
    passageiroTelefone: user?.telefone,
    status: normalizeReservaStatus(reserva.status),
    quantidadeVagas: Number(reserva.quantidadeVagas),
    dataReserva: reserva.dataReserva ?? new Date().toISOString(),
    trip: tripMap.get(reserva.viagemId),
  };
}
