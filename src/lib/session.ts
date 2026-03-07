export type SessionRole = "PASSAGEIRO" | "MOTORISTA";

export interface SessionData {
  userId: string;
  role: SessionRole;
  userName: string;
  email?: string;
}

const SESSION_KEY = "visita_conecta_session";
const ACCOUNTS_KEY = "visita_conecta_accounts";

export interface LocalAccount {
  userId: string;
  nome: string;
  email: string;
  senha: string;
  role: SessionRole;
}

export function getSession(): SessionData | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(session: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getLocalAccounts(): LocalAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as LocalAccount[];
  } catch {
    return [];
  }
}

export function saveLocalAccount(account: LocalAccount) {
  const current = getLocalAccounts();
  const filtered = current.filter((item) => item.email.toLowerCase() !== account.email.toLowerCase());
  const next = [...filtered, account];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
}
