import NetInfo from '@react-native-community/netinfo';
import { getPendingLogs, markPendingLogResolved, saveTransaction, getTransactions, markTransactionSynced } from './StorageService';
import { syncTransactionToCloud } from './FirebaseService';
import { parseSpeechToTransaction } from './LLMService';

let isSyncing = false;

// Call this occasionally or when network state indicates ONLINE
export const triggerSync = async () => {
  if (isSyncing) return;
  
  const state = await NetInfo.fetch();
  if (!state.isConnected) return; // Wait until online

  isSyncing = true;
  console.log("Starting background sync...");

  try {
    // 1. Process pending unparsed text logs using LLM
    const pendingLogs = await getPendingLogs();
    for (const log of pendingLogs) {
      if (!state.isConnected) break; // Re-check inside loop just in case
      try {
        console.log(`Parsing offline log ${log.id}`);
        // Attempt to parse missing log via Gemini/OpenAI
        const parsedTxData = await parseSpeechToTransaction(log.rawText);
        
        // Add meta
        parsedTxData.id = log.id;
        parsedTxData.timestamp = log.timestamp;
        
        // Save to Transactions DB
        await saveTransaction(parsedTxData);
        // Mark log resolved
        await markPendingLogResolved(log.id);
      } catch (err) {
        console.error("Failed parsing offline log:", err);
      }
    }

    // 2. Sync any unsynced transactions to Firebase
    const allTransactions = await getTransactions();
    const unsynced = allTransactions.filter(t => !t.is_synced);
    for (const tx of unsynced) {
      if (!state.isConnected) break;
      const success = await syncTransactionToCloud(tx);
      if (success) {
        await markTransactionSynced(tx.id);
      }
    }
  } catch (err) {
    console.error("Sync error:", err);
  } finally {
    isSyncing = false;
  }
};

// Initialize network listener
export const initSyncService = () => {
   NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
          triggerSync();
      }
   });
};
