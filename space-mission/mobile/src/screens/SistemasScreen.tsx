// src/screens/SistemasScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { sistemasApi, Sistema } from '../services/api';

export default function SistemasScreen() {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    statusOperacional: 'nominal',
    evento: '',
    responsavel: '',
    nivelEnergia: '',
  });

  useEffect(() => { carregarSistemas(); }, []);

  async function carregarSistemas() {
    setCarregando(true);
    try {
      setSistemas(await sistemasApi.listar());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os sistemas.');
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarSistema() {
    if (!form.nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    setSalvando(true);
    try {
      const salvo = await sistemasApi.criar({
        nome: form.nome,
        descricao: form.descricao || undefined,
        statusOperacional: form.statusOperacional,
        evento: form.evento || undefined,
        responsavel: form.responsavel || undefined,
        nivelEnergia: form.nivelEnergia ? parseFloat(form.nivelEnergia) : undefined,
      });
      setSistemas(prev => [salvo, ...prev]);
      setForm({ nome: '', descricao: '', statusOperacional: 'nominal', evento: '', responsavel: '', nivelEnergia: '' });
      setModalVisivel(false);
      Alert.alert('✅ Sucesso', 'Sistema cadastrado!');
    } catch {
      Alert.alert('Erro', 'Falha ao cadastrar sistema.');
    } finally {
      setSalvando(false);
    }
  }

  function corStatus(s: string) {
    return { nominal: '#00ff88', degradado: '#ffaa00', offline: '#ff4444' }[s] ?? '#aaaaaa';
  }

  function renderSistema({ item }: { item: Sistema }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <View style={[styles.badge, { borderColor: corStatus(item.statusOperacional) }]}>
            <Text style={[styles.badgeText, { color: corStatus(item.statusOperacional) }]}>
              {item.statusOperacional}
            </Text>
          </View>
        </View>
        {item.descricao && <Text style={styles.desc}>{item.descricao}</Text>}
        {item.evento && <Text style={styles.evento}>⚡ Evento: {item.evento}</Text>}
        {item.responsavel && <Text style={styles.detalhe}>👤 {item.responsavel}</Text>}
        {item.nivelEnergia !== undefined && (
          <Text style={styles.detalhe}>🔋 Energia: {item.nivelEnergia}%</Text>
        )}
        {item.dataRegistro && (
          <Text style={styles.data}>{new Date(item.dataRegistro).toLocaleString('pt-BR')}</Text>
        )}
      </View>
    );
  }

  const statusOptions = ['nominal', 'degradado', 'offline'];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoNovo} onPress={() => setModalVisivel(true)}>
        <Text style={styles.botaoNovoText}>+ Novo Sistema</Text>
      </TouchableOpacity>

      {carregando ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 40 }} />
      ) : sistemas.length === 0 ? (
        <Text style={styles.vazio}>Nenhum sistema cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={sistemas}
          keyExtractor={item => String(item.id)}
          renderItem={renderSistema}
          onRefresh={carregarSistemas}
          refreshing={carregando}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalBox} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitulo}>🛸 Cadastrar Sistema</Text>

            {[
              { label: 'Nome *', key: 'nome', placeholder: 'Ex: Sistema de Propulsão' },
              { label: 'Descrição', key: 'descricao', placeholder: 'Descreva o sistema' },
              { label: 'Evento', key: 'evento', placeholder: 'Ex: Reinicialização automática' },
              { label: 'Responsável', key: 'responsavel', placeholder: 'Nome do responsável' },
              { label: 'Nível de Energia (%)', key: 'nivelEnergia', placeholder: 'Ex: 87.5', numeric: true },
            ].map(f => (
              <View key={f.key} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={(form as any)[f.key]}
                  onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor="#444466"
                  keyboardType={f.numeric ? 'numeric' : 'default'}
                />
              </View>
            ))}

            <Text style={styles.label}>Status Operacional</Text>
            <View style={styles.statusRow}>
              {statusOptions.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusBtn, form.statusOperacional === s && styles.statusBtnAtivo]}
                  onPress={() => setForm(p => ({ ...p, statusOperacional: s }))}>
                  <Text style={[styles.statusBtnText, form.statusOperacional === s && { color: '#00d4ff', fontWeight: 'bold' }]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && { opacity: 0.6 }]}
              onPress={cadastrarSistema} disabled={salvando}>
              <Text style={styles.botaoSalvarText}>{salvando ? 'Salvando...' : 'Salvar Sistema'}</Text>
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
  botaoNovo: { margin: 12, padding: 14, backgroundColor: '#001830', borderRadius: 10, borderWidth: 1, borderColor: '#00d4ff', alignItems: 'center' },
  botaoNovoText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 15 },
  vazio: { color: '#555577', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#0a0a1a', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1a1a3e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardNome: { color: '#eeeeff', fontWeight: 'bold', fontSize: 15, flex: 1 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  desc: { color: '#8888aa', fontSize: 13, marginBottom: 4 },
  evento: { color: '#ffaa00', fontSize: 13, marginTop: 2 },
  detalhe: { color: '#666688', fontSize: 12, marginTop: 2 },
  data: { color: '#333355', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#0a0a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitulo: { color: '#00d4ff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { color: '#8888aa', fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#050520', borderRadius: 8, borderWidth: 1, borderColor: '#1a1a3e', color: '#eeeeff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statusBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#333355', alignItems: 'center' },
  statusBtnAtivo: { backgroundColor: '#001830', borderColor: '#00d4ff' },
  statusBtnText: { color: '#555577', fontSize: 12 },
  botaoSalvar: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  botaoSalvarText: { color: '#000011', fontWeight: 'bold', fontSize: 15 },
  botaoCancelar: { padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  botaoCancelarText: { color: '#555577', fontSize: 14 },
});
