export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://erh4972xsh.execute-api.us-east-1.amazonaws.com";

export type ApiRole = "ADMIN" | "PASSAGEIRO" | "MOTORISTA" | "MODERADOR";

export interface ApiUsuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senhaHash?: string;
  cpf: string;
  status: number | string;
  role?: ApiRole;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  perfis?: ApiRole[];
}

export interface ApiVehicle {
  id: number;
  driverId: number;
  vehicleTypeId?: number;
  model: string;
  brand: string;
  year: number;
  plate: string;
  seats: number;
  color: string;
  createdAt?: string;
  // Optional relations (can be null in responses)
  driver?: unknown;
  vehicleType?: unknown;
  documents?: unknown[];
  rides?: unknown[];
}

export interface ApiMotorista {
  usuarioId: string;
  vehicleId?: number;
  vehicles?: ApiVehicle[];
  cnhNumero: string;
  cnhValidade: string;
  veiculoModelo: string;
  veiculoPlaca: string;
  aprovado: boolean;
  vehicleTypeId?: number;
  veiculoMarca?: string;
  veiculoAno?: number;
  veiculoAssentos?: number;
  veiculoCor?: string;
  capacidadeVeiculo?: number;
}

export interface ApiPresidio {
  id: string;
  nome: string;
  estado: string;
  cidade: string;
  horarioVisita: string | string[];
  requisitosDocumentos: string | string[];
  itensPermitidos: string | string[];
  regrasVestimenta: string | string[];
  normasReferencia?: string | null;
  ultimaAtualizacao?: string;
}

export interface ApiViagem {
  id: string;
  motoristaId: string;
  vehicleId?: number;
  presidioId: string;
  dataSaida: string;
  valor: number;
  vagasTotais: number;
  vagasDisponiveis?: number;
  status?: number | string;
}

export interface ApiReserva {
  id: string;
  viagemId: string;
  passageiroId: string;
  status: number | string;
  quantidadeVagas: number;
  dataReserva?: string;
  avaliacaoMotorista?: number | null;
}

export interface ApiErrorPayload {
  message?: string;
  title?: string;
  error?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

function extractBadRequestMessage(payload: ApiErrorPayload | null): string | null {
  if (!payload) return null;

  const directMessage = payload.message ?? payload.detail ?? payload.error;
  if (typeof directMessage === "string" && directMessage.trim().length > 0) {
    return directMessage;
  }

  if (payload.errors && typeof payload.errors === "object") {
    const firstError = Object.values(payload.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .find((value) => typeof value === "string" && value.trim().length > 0);

    if (firstError) {
      return firstError;
    }
  }

  if (typeof payload.title === "string" && payload.title.trim().length > 0) {
    return payload.title;
  }

  return null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body !== undefined;
  const mergedHeaders: HeadersInit = {
    ...(init?.headers ?? {}),
  };

  if (hasBody && !(mergedHeaders as Record<string, string>)["Content-Type"]) {
    (mergedHeaders as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: mergedHeaders,
    ...init,
  });

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const payload = typeof body === "object" && body !== null ? (body as ApiErrorPayload) : null;
    const badRequestMessage = response.status === 400 ? extractBadRequestMessage(payload) ?? (typeof body === "string" ? body : null) : null;
    const message = badRequestMessage ?? `Erro HTTP ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
  } catch {
    // fallback to split by comma
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeUsuarioStatus(value: number | string): "Ativo" | "Bloqueado" | "Pendente" {
  if (typeof value === "number") {
    if (value === 1) return "Ativo";
    if (value === 2) return "Bloqueado";
    return "Pendente";
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("ativo")) return "Ativo";
  if (normalized.includes("bloq")) return "Bloqueado";
  return "Pendente";
}

export function normalizeReservaStatus(value: number | string): "Pendente" | "Confirmada" | "Cancelada" {
  if (typeof value === "number") {
    if (value === 2) return "Confirmada";
    if (value === 3) return "Cancelada";
    return "Pendente";
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("confirm")) return "Confirmada";
  if (normalized.includes("cancel") || normalized.includes("recus")) return "Cancelada";
  return "Pendente";
}

export function normalizeTripStatus(value: number | string | undefined, vagasDisponiveis: number): "Ativa" | "Lotada" | "Cancelada" | "Finalizada" {
  if (typeof value === "number") {
    if (value === 2) return "Cancelada";
    if (value === 3) return "Finalizada";
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("cancel")) return "Cancelada";
    if (normalized.includes("final")) return "Finalizada";
    if (normalized.includes("lotad")) return "Lotada";
    if (normalized.includes("ativ")) return "Ativa";
  }

  return vagasDisponiveis <= 0 ? "Lotada" : "Ativa";
}

export const api = {
  health: () => request<{ status?: string; message?: string }>("/health"),

  login: (email: string, senha: string) =>
    request<{ id: number; role: ApiRole; nome: string; email: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      }
    ),

  listUsuarios: () => request<ApiUsuario[]>("/api/usuarios"),
  getUsuario: (id: number) => request<ApiUsuario>(`/api/usuarios/${id}`),
  createUsuario: (payload: Omit<ApiUsuario, "id">) =>
    request<ApiUsuario>("/api/usuarios", { method: "POST", body: JSON.stringify(payload) }),
  updateUsuario: (id: number, payload: Omit<ApiUsuario, "id">) =>
    request<ApiUsuario>(`/api/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteUsuario: (id: number) => request<void>(`/api/usuarios/${id}`, { method: "DELETE" }),

  listMotoristas: () => request<ApiMotorista[]>("/api/motoristas"),
  getMotorista: (usuarioId: string) => request<ApiMotorista>(`/api/motoristas/${usuarioId}`),
  createMotorista: (payload: ApiMotorista) =>
    request<ApiMotorista>("/api/motoristas", { method: "POST", body: JSON.stringify(payload) }),
  updateMotorista: (usuarioId: string, payload: ApiMotorista) =>
    request<ApiMotorista>(`/api/motoristas/${usuarioId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteMotorista: (usuarioId: string) => request<void>(`/api/motoristas/${usuarioId}`, { method: "DELETE" }),

  listPresidios: () => request<ApiPresidio[]>("/api/presidios"),
  getPresidio: (id: string) => request<ApiPresidio>(`/api/presidios/${id}`),
  createPresidio: (payload: Omit<ApiPresidio, "id">) =>
    request<ApiPresidio>("/api/presidios", { method: "POST", body: JSON.stringify(payload) }),
  updatePresidio: (id: string, payload: Omit<ApiPresidio, "id">) =>
    request<ApiPresidio>(`/api/presidios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deletePresidio: (id: string) => request<void>(`/api/presidios/${id}`, { method: "DELETE" }),

  listViagens: () => request<ApiViagem[]>("/api/viagens"),
  getViagem: (id: string) => request<ApiViagem>(`/api/viagens/${id}`),
  createViagem: (payload: Omit<ApiViagem, "id" | "status" | "vagasDisponiveis">) =>
    request<ApiViagem>("/api/viagens", { method: "POST", body: JSON.stringify(payload) }),
  updateViagem: (id: string, payload: Omit<ApiViagem, "id" | "status" | "vagasDisponiveis">) =>
    request<ApiViagem>(`/api/viagens/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteViagem: (id: string) => request<void>(`/api/viagens/${id}`, { method: "DELETE" }),

  listReservas: () => request<ApiReserva[]>("/api/reservas"),
  getReserva: (id: string) => request<ApiReserva>(`/api/reservas/${id}`),
  createReserva: (payload: { viagemId: string; passageiroId: string; quantidadeVagas: number }) =>
    request<ApiReserva>("/api/reservas", { method: "POST", body: JSON.stringify(payload) }),
  patchReservaStatus: (id: string, payload: { status: number; avaliacaoMotorista?: number }) =>
    request<ApiReserva>(`/api/reservas/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteReserva: (id: string) => request<void>(`/api/reservas/${id}`, { method: "DELETE" }),

  parseJsonArray,
};
