// src/screens/HomeScreen.tsx
// Tela principal: painel geral da missão com estatísticas

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { sensoresApi, alertasApi } from '../services/api';

export default function HomeScreen() {
  // Estado para guardar os dados carregados
  const [resumoSensores, setResumoSensores] = useState<Record<string, number> | null>(null);
  const [resumoAlertas, setResumoAlertas] = useState<Record<string, number> | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // useEffect executa quando a tela carrega
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro(null);
    try {
      // Busca os dois resumos ao mesmo tempo (mais eficiente)
      const [sensores, alertas] = await Promise.all([
        sensoresApi.resumo(),
        alertasApi.resumo(),
      ]);
      setResumoSensores(sensores);
      setResumoAlertas(alertas);
    } catch (e) {
      setErro('Não foi possível conectar à API. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralized}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Conectando à missão...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        // Pull-to-refresh: arrasta a tela para baixo para recarregar
        <RefreshControl refreshing={carregando} onRefresh={carregarDados} tintColor="#00d4ff" />
      }>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>🚀 CONTROLE DE MISSÃO</Text>
        <Text style={styles.subtitulo}>Sistema Integrado Espacial v1.0</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SISTEMA ONLINE</Text>
        </View>
      </View>

      {erro && (
        <View style={styles.erroBox}>
          <Text style={styles.erroText}>⚠️ {erro}</Text>
          <TouchableOpacity onPress={carregarDados}>
            <Text style={styles.tentarNovamente}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card de Sensores */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>📡 Sensores</Text>
        <View style={styles.statsRow}>
          <StatBox label="Total" valor={resumoSensores?.total ?? 0} cor="#00d4ff" />
          <StatBox label="Ativos" valor={resumoSensores?.ativos ?? 0} cor="#00ff88" />
          <StatBox label="Falha" valor={resumoSensores?.comFalha ?? 0} cor="#ff4444" />
        </View>
      </View>

      {/* Card de Alertas */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>🔔 Alertas</Text>
        <View style={styles.statsRow}>
          <StatBox label="Total" valor={resumoAlertas?.total ?? 0} cor="#00d4ff" />
          <StatBox label="Ativos" valor={resumoAlertas?.ativos ?? 0} cor="#ffaa00" />
          <StatBox label="Críticos" valor={resumoAlertas?.criticos ?? 0} cor="#ff4444" />
        </View>
      </View>

      <Text style={styles.dica}>↓ Arraste para baixo para atualizar</Text>
    </ScrollView>
  );
}

// Componente interno: caixinha de estatística
function StatBox({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' },
  centralized: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050510' },
  loadingText: { color: '#00d4ff', marginTop: 12, fontSize: 14 },

  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3e',
  },
  titulo: { color: '#00d4ff', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  subtitulo: { color: '#8888aa', fontSize: 12, marginTop: 4 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001a00',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  statusDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#00ff88', marginRight: 6,
  },
  statusText: { color: '#00ff88', fontSize: 11, fontWeight: 'bold' },

  erroBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1a0000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
    alignItems: 'center',
  },
  erroText: { color: '#ff8888', textAlign: 'center' },
  tentarNovamente: { color: '#00d4ff', marginTop: 8, fontWeight: 'bold' },

  card: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    backgroundColor: '#0a0a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a3e',
  },
  cardTitulo: { color: '#ccccee', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center', flex: 1 },
  statValor: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { color: '#8888aa', fontSize: 12, marginTop: 2 },

  dica: { color: '#333355', textAlign: 'center', marginVertical: 20, fontSize: 12 },
});
