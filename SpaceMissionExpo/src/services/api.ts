const BASE_URL = 'http://10.0.2.2:8080/api';

export type Sensor = {
  id?: number; nome: string; tipo: string; status: string;
  leituraAtual?: number; unidade?: string; moduloInstalado?: string; dataRegistro?: string;
};
export type Sistema = {
  id?: number; nome: string; descricao?: string; statusOperacional: string;
  evento?: string; responsavel?: string; nivelEnergia?: number; dataRegistro?: string;
};
export type Alerta = {
  id?: number; tipo: string; descricao: string; nivelCriticidade: string;
  origem?: string; resolvido?: boolean; acaoTomada?: string; dataRegistro?: string;
};

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!r.ok) throw new Error(`Erro GET ${path}: ${r.status}`);
  return r.json();
}
async function post<T>(path: string, body: object): Promise<T> {
  const r = await fetch(`${BASE_URL}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Erro POST ${path}: ${r.status}`);
  return r.json();
}

export const sensoresApi = {
  listar: () => get<Sensor[]>('/sensores'),
  criar: (s: Sensor) => post<Sensor>('/sensores', s),
  resumo: () => get<Record<string, number>>('/sensores/resumo'),
};
export const sistemasApi = {
  listar: () => get<Sistema[]>('/sistemas'),
  criar: (s: Sistema) => post<Sistema>('/sistemas', s),
};
export const alertasApi = {
  listar: () => get<Alerta[]>('/alertas'),
  listarAtivos: () => get<Alerta[]>('/alertas/ativos'),
  criar: (a: Alerta) => post<Alerta>('/alertas', a),
  resumo: () => get<Record<string, number>>('/alertas/resumo'),
};
