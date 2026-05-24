// src/screens/SensoresScreen.tsx
// Lista sensores (GET) e permite cadastrar novos (POST)

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { sensoresApi, Sensor } from '../services/api';

export default function SensoresScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Campos do formulário de cadastro
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    status: 'ativo',
    leituraAtual: '',
    unidade: '',
    moduloInstalado: '',
  });

  useEffect(() => {
    carregarSensores();
  }, []);

  async function carregarSensores() {
    setCarregando(true);
    try {
      const data = await sensoresApi.listar();
      setSensores(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os sensores.');
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarSensor() {
    // Validação básica
    if (!form.nome.trim() || !form.tipo.trim()) {
      Alert.alert('Atenção', 'Nome e Tipo são obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      const novoSensor: Sensor = {
        nome: form.nome,
        tipo: form.tipo,
        status: form.status,
        leituraAtual: form.leituraAtual ? parseFloat(form.leituraAtual) : undefined,
        unidade: form.unidade || undefined,
        moduloInstalado: form.moduloInstalado || undefined,
      };

      // POST para a API
      const salvo = await sensoresApi.criar(novoSensor);

      // Adiciona no início da lista (sem precisar recarregar tudo)
      setSensores(prev => [salvo, ...prev]);

      // Limpa o formulário e fecha o modal
      setForm({ nome: '', tipo: '', status: 'ativo', leituraAtual: '', unidade: '', moduloInstalado: '' });
      setModalVisivel(false);
      Alert.alert('✅ Sucesso', 'Sensor cadastrado com sucesso!');
    } catch {
      Alert.alert('Erro', 'Falha ao cadastrar sensor.');
    } finally {
      setSalvando(false);
    }
  }

  // Cor do badge de status
  function corStatus(status: string) {
    const cores: Record<string, string> = {
      ativo: '#00ff88',
      inativo: '#888888',
      com_falha: '#ff4444',
    };
    return cores[status] ?? '#aaaaaa';
  }

  // Renderiza cada item da lista
  function renderSensor({ item }: { item: Sensor }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <View style={[styles.badge, { borderColor: corStatus(item.status) }]}>
            <Text style={[styles.badgeText, { color: corStatus(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.cardTipo}>Tipo: {item.tipo}</Text>
        {item.leituraAtual !== undefined && (
          <Text style={styles.cardLeitura}>
            Leitura: <Text style={styles.valorDestaque}>{item.leituraAtual} {item.unidade}</Text>
          </Text>
        )}
        {item.moduloInstalado && (
          <Text style={styles.cardModulo}>📍 {item.moduloInstalado}</Text>
        )}
        {item.dataRegistro && (
          <Text style={styles.cardData}>
            {new Date(item.dataRegistro).toLocaleString('pt-BR')}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão para abrir modal de cadastro */}
      <TouchableOpacity style={styles.botaoNovo} onPress={() => setModalVisivel(true)}>
        <Text style={styles.botaoNovoText}>+ Novo Sensor</Text>
      </TouchableOpacity>

      {carregando ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 40 }} />
      ) : sensores.length === 0 ? (
        <Text style={styles.vazio}>Nenhum sensor cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={sensores}
          keyExtractor={item => String(item.id)}
          renderItem={renderSensor}
          onRefresh={carregarSensores}
          refreshing={carregando}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      {/* Modal de cadastro */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalBox} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitulo}>📡 Cadastrar Sensor</Text>

            <Campo label="Nome *" value={form.nome} onChange={v => setForm(p => ({ ...p, nome: v }))} placeholder="Ex: Sensor de Temperatura A1" />
            <Campo label="Tipo *" value={form.tipo} onChange={v => setForm(p => ({ ...p, tipo: v }))} placeholder="Ex: temperatura" />
            <Campo label="Leitura Atual" value={form.leituraAtual} onChange={v => setForm(p => ({ ...p, leituraAtual: v }))} placeholder="Ex: 23.5" keyboardType="numeric" />
            <Campo label="Unidade" value={form.unidade} onChange={v => setForm(p => ({ ...p, unidade: v }))} placeholder="Ex: °C" />
            <Campo label="Módulo Instalado" value={form.moduloInstalado} onChange={v => setForm(p => ({ ...p, moduloInstalado: v }))} placeholder="Ex: Módulo A" />

            {/* Seletor de status */}
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {['ativo', 'inativo', 'com_falha'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusBtn, form.status === s && styles.statusBtnAtivo]}
                  onPress={() => setForm(p => ({ ...p, status: s }))}>
                  <Text style={[styles.statusBtnText, form.status === s && styles.statusBtnTextAtivo]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && { opacity: 0.6 }]}
              onPress={cadastrarSensor}
              disabled={salvando}>
              <Text style={styles.botaoSalvarText}>
                {salvando ? 'Salvando...' : 'Salvar Sensor'}
              </Text>
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

// Componente de campo de formulário reutilizável
function Campo({ label, value, onChange, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#444466"
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' },
  botaoNovo: {
    margin: 12,
    padding: 14,
    backgroundColor: '#001830',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00d4ff',
    alignItems: 'center',
  },
  botaoNovoText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 15 },
  vazio: { color: '#555577', textAlign: 'center', marginTop: 40, fontSize: 14 },

  card: {
    backgroundColor: '#0a0a1a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a1a3e',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardNome: { color: '#eeeeff', fontWeight: 'bold', fontSize: 15, flex: 1 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  cardTipo: { color: '#8888aa', fontSize: 13 },
  cardLeitura: { color: '#8888aa', fontSize: 13, marginTop: 2 },
  valorDestaque: { color: '#00d4ff', fontWeight: 'bold' },
  cardModulo: { color: '#666688', fontSize: 12, marginTop: 4 },
  cardData: { color: '#333355', fontSize: 11, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#0a0a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitulo: { color: '#00d4ff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { color: '#8888aa', fontSize: 12, marginBottom: 4, marginTop: 4 },
  input: {
    backgroundColor: '#050520',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a1a3e',
    color: '#eeeeff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statusBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#333355', alignItems: 'center' },
  statusBtnAtivo: { backgroundColor: '#001830', borderColor: '#00d4ff' },
  statusBtnText: { color: '#555577', fontSize: 12 },
  statusBtnTextAtivo: { color: '#00d4ff', fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  botaoSalvarText: { color: '#000011', fontWeight: 'bold', fontSize: 15 },
  botaoCancelar: { padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  botaoCancelarText: { color: '#555577', fontSize: 14 },
});
