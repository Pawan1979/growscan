import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Voice from '@react-native-voice/voice';
import NetInfo from '@react-native-community/netinfo';
import { getTransactions, savePendingLog } from '../services/StorageService';
import { triggerSync } from '../services/SyncService';
import { parseSpeechToTransaction } from '../services/LLMService';

export default function HomeScreen({ navigateToSettings }) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Setup voice listeners
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = onSpeechResults;

    NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    loadData();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const loadData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const onSpeechResults = async (e) => {
    if (e.value && e.value.length > 0) {
      const text = e.value[0];
      setRecognizedText(text);
      await processSpeech(text);
    }
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setRecognizedText('');
      // Using hi-IN for Hindi/Hinglish priority, but it generally supports Marathi and Punjabi well too
      // User can switch their keyboard/voice language dynamically in native UI
      await Voice.start('hi-IN');
      setIsListening(true);
    } catch (e) {
      console.error(e);
      alert("Microphone Error: Make sure microphone permissions are granted.");
    }
  };

  const stopListening = async () => {
     try {
       await Voice.stop();
       setIsListening(false);
     } catch (e) {
       console.error(e);
     }
  };

  const processSpeech = async (text) => {
    setIsLoading(true);
    const id = Date.now().toString();

    if (!isOnline) {
      // Offline mode
      await savePendingLog(id, text);
      alert("Saved locally! Will process when online.");
    } else {
      // Try to parse online immediately
      try {
        const parsedTxData = await parseSpeechToTransaction(text);
        parsedTxData.id = id;
        parsedTxData.timestamp = Date.now();
        
        await triggerSync(); // Will save the transaction natively via Sync module simulation
      } catch (err) {
         // Fallback to queue if LLM fails
         console.warn(err);
         await savePendingLog(id, text);
         alert("Couldn't process right now. Saved to queue.");
      }
    }
    
    await loadData();
    setIsLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.customerName}</Text>
        <Text style={[styles.statusBadge, item.paymentStatus === 'CREDIT' ? styles.creditBadge : styles.cashBadge]}>
            {item.paymentStatus}
        </Text>
      </View>
      <View style={styles.itemsWrapper}>
        {(item.items || []).map((itm, idx) => (
          <Text key={idx} style={styles.itemText}>• {itm.name} ({itm.quantity})</Text>
        ))}
      </View>
      <Text style={styles.totalText}>Total: {item.totalAmount ? `₹${item.totalAmount}` : 'N/A'}</Text>
      <Text style={styles.syncStatus}>{item.is_synced ? '☁️ Synced' : '⏳ Saved Locally'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kirana Ledger</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={navigateToSettings}>
          <Text style={styles.settingsBtnText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.networkStatus}>
        <Text style={{color: isOnline ? 'green' : 'red'}}>
          {isOnline ? '🟢 Online' : '🔴 Offline Mode'}
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
      />

      {recognizedText ? (
        <View style={styles.textBox}>
           <Text style={styles.speechText}>"{recognizedText}"</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
         {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
         ) : (
            <TouchableOpacity 
              style={[styles.micButton, isListening && styles.micListening]} 
              onPress={isListening ? stopListening : startListening}
            >
              <Text style={styles.micIcon}>{isListening ? '🛑' : '🎤'}</Text>
            </TouchableOpacity>
         )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  settingsBtn: { padding: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
  settingsBtnText: { fontSize: 16 },
  networkStatus: { padding: 8, alignItems: 'center', backgroundColor: '#e2e8f0', marginHorizontal: 20, marginTop: 15, borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#666', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  creditBadge: { backgroundColor: '#fee2e2', color: '#991b1b' },
  cashBadge: { backgroundColor: '#dcfce7', color: '#166534' },
  itemsWrapper: { marginVertical: 8 },
  itemText: { fontSize: 14, color: '#4a4a4a', marginVertical: 2 },
  totalText: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  syncStatus: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 8 },
  footer: { padding: 30, alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  textBox: { padding: 15, marginHorizontal: 20, backgroundColor: '#e0f2fe', borderRadius: 8, marginBottom: 10 },
  speechText: { fontStyle: 'italic', color: '#0369a1' },
  micButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', shadowColor: '#2563eb', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  micListening: { backgroundColor: '#ef4444' },
  micIcon: { fontSize: 36 }
});
