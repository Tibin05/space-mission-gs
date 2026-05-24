// src/screens/AlertasScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { alertasApi, Alerta } from '../services/api';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [filtroAtivos, setFiltroAtivos] = useState(false);

  const [form, setForm] = useState({
    tipo: '',
    descricao: '',
    nivelCriticidade: 'medio',
    origem: '',
  });

  useEffect(() => { carregarAlertas(); }, [filtroAtivos]);

  async function carregarAlertas() {
    setCarregando(true);
    try {
      const data = filtroAtivos
        ? await alertasApi.listarAtivos()
        : await alertasApi.listar();
      setAlertas(data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar alertas.');
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarAlerta() {
    if (!form.tipo.trim() || !form.descricao.trim()) {
      Alert.alert('Atenção', 'Tipo e Descrição são obrigatórios.');
      return;
    }
    setSalvando(true);
    try {
      const salvo = await alertasApi.criar({
        tipo: form.tipo,
        descricao: form.descricao,
        nivelCriticidade: form.nivelCriticidade,
        origem: form.origem || undefined,
        resolvido: false,
      });
      setAlertas(prev => [salvo, ...prev]);
      setForm({ tipo: '', descricao: '', nivelCriticidade: 'medio', origem: '' });
      setModalVisivel(false);
      Alert.alert('✅ Alerta registrado!');
    } catch {
      Alert.alert('Erro', 'Falha ao cadastrar alerta.');
    } finally {
      setSalvando(false);
    }
  }

  function corNivel(nivel: string) {
    return { baixo: '#00ff88', medio: '#ffaa00', alto: '#ff8800', critico: '#ff4444' }[nivel] ?? '#aaaaaa';
  }

  function iconNivel(nivel: string) {
    return { baixo: 'ℹ️', medio: '⚠️', alto: '🔴', critico: '💀' }[nivel] ?? '❓';
  }

  function renderAlerta({ item }: { item: Alerta }) {
    return (
      <View style={[styles.card, item.resolvido && styles.cardResolvido]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTipo}>{iconNivel(item.nivelCriticidade)} {item.tipo}</Text>
          <View style={[styles.badge, { borderColor: corNivel(item.nivelCriticidade) }]}>
            <Text style={[styles.badgeText, { color: corNivel(item.nivelCriticidade) }]}>
              {item.nivelCriticidade}
            </Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>{item.descricao}</Text>
        {item.origem && <Text style={styles.detalhe}>📡 Origem: {item.origem}</Text>}
        <View style={styles.resolvidoRow}>
          <Text style={[styles.resolvidoText, { color: item.resolvido ? '#00ff88' : '#ff4444' }]}>
            {item.resolvido ? '✅ Resolvido' : '🔔 Ativo'}
          </Text>
          {item.dataRegistro && (
            <Text style={styles.data}>{new Date(item.dataRegistro).toLocaleString('pt-BR')}</Text>
          )}
        </View>
      </View>
    );
  }

  const niveis = ['baixo', 'medio', 'alto', 'critico'];

  return (
    <View style={styles.container}>
      {/* Botões de ação */}
      <View style={styles.acoes}>
        <TouchableOpacity style={styles.botaoNovo} onPress={() => setModalVisivel(true)}>
          <Text style={styles.botaoNovoText}>+ Novo Alerta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoFiltro, filtroAtivos && styles.botaoFiltroAtivo]}
          onPress={() => setFiltroAtivos(!filtroAtivos)}>
          <Text style={[styles.botaoFiltroText, filtroAtivos && { color: '#ffaa00' }]}>
            {filtroAtivos ? '🔔 Apenas Ativos' : 'Todos'}
          </Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 40 }} />
      ) : alertas.length === 0 ? (
        <Text style={styles.vazio}>
          {filtroAtivos ? 'Nenhum alerta ativo. 🎉' : 'Nenhum alerta cadastrado ainda.'}
        </Text>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={item => String(item.id)}
          renderItem={renderAlerta}
          onRefresh={carregarAlertas}
          refreshing={carregando}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalBox} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitulo}>🔔 Registrar Alerta</Text>

            {[
              { label: 'Tipo *', key: 'tipo', placeholder: 'Ex: temperatura_critica' },
              { label: 'Descrição *', key: 'descricao', placeholder: 'Descreva o alerta em detalhes' },
              { label: 'Origem', key: 'origem', placeholder: 'Ex: Sensor A1, Sistema de Propulsão' },
            ].map(f => (
              <View key={f.key} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={(form as any)[f.key]}
                  onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor="#444466"
                  multiline={f.key === 'descricao'}
                  numberOfLines={f.key === 'descricao' ? 3 : 1}
                />
              </View>
            ))}

            <Text style={styles.label}>Nível de Criticidade</Text>
            <View style={styles.statusRow}>
              {niveis.map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.nivelBtn, form.nivelCriticidade === n && { borderColor: corNivel(n), backgroundColor: '#050520' }]}
                  onPress={() => setForm(p => ({ ...p, nivelCriticidade: n }))}>
                  <Text style={[styles.nivelBtnText, form.nivelCriticidade === n && { color: corNivel(n), fontWeight: 'bold' }]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && { opacity: 0.6 }]}
              onPress={cadastrarAlerta} disabled={salvando}>
              <Text style={styles.botaoSalvarText}>{salvando ? 'Salvando...' : 'Registrar Alerta'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.botaoCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' },
  acoes: { flexDirection: 'row', padding: 12, gap: 8 },
  botaoNovo: { flex: 2, padding: 14, backgroundColor: '#001830', borderRadius: 10, borderWidth: 1, borderColor: '#00d4ff', alignItems: 'center' },
  botaoNovoText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 14 },
  botaoFiltro: { flex: 1, padding: 14, backgroundColor: '#0a0a1a', borderRadius: 10, borderWidth: 1, borderColor: '#333355', alignItems: 'center' },
  botaoFiltroAtivo: { borderColor: '#ffaa00', backgroundColor: '#1a0e00' },
  botaoFiltroText: { color: '#555577', fontSize: 13 },
  vazio: { color: '#555577', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#0a0a1a', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1a1a3e' },
  cardResolvido: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTipo: { color: '#eeeeff', fontWeight: 'bold', fontSize: 14, flex: 1 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  cardDesc: { color: '#8888aa', fontSize: 13, marginBottom: 6 },
  detalhe: { color: '#666688', fontSize: 12, marginBottom: 4 },
  resolvidoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  resolvidoText: { fontSize: 12, fontWeight: 'bold' },
  data: { color: '#333355', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#0a0a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitulo: { color: '#00d4ff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { color: '#8888aa', fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#050520', borderRadius: 8, borderWidth: 1, borderColor: '#1a1a3e', color: '#eeeeff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  statusRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  nivelBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#333355' },
  nivelBtnText: { color: '#555577', fontSize: 12 },
  botaoSalvar: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  botaoSalvarText: { color: '#000011', fontWeight: 'bold', fontSize: 15 },
  botaoCancelar: { padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  botaoCancelarText: { color: '#555577', fontSize: 14 },
});
