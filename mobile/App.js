import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { initDb } from './src/services/StorageService';
import { initSyncService } from './src/services/SyncService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // App Initialization
    const setup = async () => {
      try {
        await initDb();
        initSyncService();
        setIsDbReady(true);
      } catch(e) {
        console.error("DB Init failed:", e);
      }
    };
    setup();
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Booting Kirana Ledger...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'Home' ? (
         <HomeScreen navigateToSettings={() => setCurrentScreen('Settings')} />
      ) : (
         <SettingsScreen navigateToHome={() => setCurrentScreen('Home')} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
