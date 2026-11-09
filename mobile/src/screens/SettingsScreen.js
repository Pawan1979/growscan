import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSelectedLLMConfig } from '../services/LLMService';

export default function SettingsScreen({ navigateToHome }) {
  const [provider, setProvider] = useState('openai'); // openai, gemini, anthropic
  const [keys, setKeys] = useState({ openai: '', gemini: '', anthropic: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const config = await getSelectedLLMConfig();
    setProvider(config.provider || 'openai');
    if (config.keys) setKeys(config.keys);
  };

  const saveSettings = async () => {
    const configToSave = { provider, keys };
    await AsyncStorage.setItem('llm_config', JSON.stringify(configToSave));
    alert('Settings Saved Successfully!');
    navigateToHome();
  };

  const updateKey = (prov, value) => {
    setKeys(prev => ({ ...prev, [prov]: value }));
  };

  const ProviderCard = ({ title, id }) => {
    const isSelected = provider === id;
    return (
      <TouchableOpacity 
        style={[styles.providerCard, isSelected && styles.providerCardSelected]} 
        onPress={() => setProvider(id)}
      >
        <Text style={[styles.providerTitle, isSelected && styles.providerTitleSelected]}>{title}</Text>
        {isSelected && <Text style={styles.badge}>Active</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={navigateToHome}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Settings</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.sectionTitle}>Select AI Provider</Text>
        <Text style={styles.subtitle}>Choose which intelligence to use for extracting Hindi/Hinglish speech to order data.</Text>
        
        <View style={styles.providerList}>
          <ProviderCard title="OpenAI" id="openai" />
          <ProviderCard title="Google Gemini" id="gemini" />
          <ProviderCard title="Anthropic Claude" id="anthropic" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>OpenAI API Key</Text>
          <TextInput
             style={styles.input}
             placeholder="sk-..."
             value={keys.openai}
             onChangeText={(v) => updateKey('openai', v)}
             secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gemini API Key</Text>
          <TextInput
             style={styles.input}
             placeholder="AIzaSy..."
             value={keys.gemini}
             onChangeText={(v) => updateKey('gemini', v)}
             secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Anthropic API Key</Text>
          <TextInput
             style={styles.input}
             placeholder="sk-ant-..."
             value={keys.anthropic}
             onChangeText={(v) => updateKey('anthropic', v)}
             secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={saveSettings}>
          <Text style={styles.saveBtnText}>Save Configuration</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  backBtn: { padding: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
  backBtnText: { fontSize: 16, color: '#334155' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 5, marginBottom: 20 },
  providerList: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  providerCard: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  providerCardSelected: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  providerTitle: { fontSize: 14, fontWeight: '600', color: '#475569', textAlign: 'center' },
  providerTitleSelected: { color: '#1d4ed8' },
  badge: { marginTop: 8, fontSize: 10, backgroundColor: '#d1fae5', color: '#065f46', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 15, fontSize: 16, color: '#0f172a' },
  saveBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
