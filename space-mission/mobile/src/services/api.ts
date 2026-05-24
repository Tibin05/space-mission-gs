// src/services/api.ts
// =====================================================================
// Centraliza todas as chamadas HTTP para o backend Spring Boot
// Mude BASE_URL conforme necessário:
//   - Emulador Android: http://10.0.2.2:8080
//   - Dispositivo físico: use o IP da sua máquina (ex: http://192.168.0.10:8080)
//   - iOS Simulator: http://localhost:8080
// =====================================================================

const BASE_URL = 'http://10.0.2.2:8080/api'; // Emulador Android

// ---- Tipos TypeScript ----
// Definem a "forma" dos objetos que vêm/vão para a API

export type Sensor = {
  id?: number;
  nome: string;
  tipo: string;
  status: string;
  leituraAtual?: number;
  unidade?: string;
  moduloInstalado?: string;
  dataRegistro?: string;
};

export type Sistema = {
  id?: number;
  nome: string;
  descricao?: string;
  statusOperacional: string;
  evento?: string;
  responsavel?: string;
  nivelEnergia?: number;
  dataRegistro?: string;
};

export type Alerta = {
  id?: number;
  tipo: string;
  descricao: string;
  nivelCriticidade: string;
  origem?: string;
  resolvido?: boolean;
  acaoTomada?: string;
  dataRegistro?: string;
};

// ---- Helpers internos ----

// Função que faz GET e retorna os dados já convertidos para objeto JS
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição GET ${path}: ${response.status}`);
  }

  return response.json();
}

// Função que faz POST enviando um objeto como JSON
async function post<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), // converte objeto JS → string JSON
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição POST ${path}: ${response.status}`);
  }

  return response.json();
}

// ---- API de Sensores ----
export const sensoresApi = {
  listar: ()                => get<Sensor[]>('/sensores'),
  buscarPorId: (id: number) => get<Sensor>(`/sensores/${id}`),
  criar: (sensor: Sensor)   => post<Sensor>('/sensores', sensor),
  resumo: ()                => get<Record<string, number>>('/sensores/resumo'),
};

// ---- API de Sistemas ----
export const sistemasApi = {
  listar: ()                 => get<Sistema[]>('/sistemas'),
  buscarPorId: (id: number)  => get<Sistema>(`/sistemas/${id}`),
  criar: (sistema: Sistema)  => post<Sistema>('/sistemas', sistema),
};

// ---- API de Alertas ----
export const alertasApi = {
  listar: ()                  => get<Alerta[]>('/alertas'),
  listarAtivos: ()            => get<Alerta[]>('/alertas/ativos'),
  buscarPorId: (id: number)   => get<Alerta>(`/alertas/${id}`),
  criar: (alerta: Alerta)     => post<Alerta>('/alertas', alerta),
  resumo: ()                  => get<Record<string, number>>('/alertas/resumo'),
};
