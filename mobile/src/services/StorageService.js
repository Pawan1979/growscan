import * as SQLite from 'expo-sqlite';

let db = null;

export const initDb = async () => {
    db = await SQLite.openDatabaseAsync('kirana.db');

    // Make sure our tables exist
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY NOT NULL,
            customerName TEXT,
            items TEXT,
            paymentStatus TEXT,
            totalAmount REAL,
            timestamp INTEGER,
            is_synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS pending_logs (
            id TEXT PRIMARY KEY NOT NULL,
            rawText TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            status TEXT DEFAULT 'PENDING'
        );
    `);
    console.log("DB Initialized");
};

// Returns all offline logs that couldn't be parsed yet
export const getPendingLogs = async () => {
    if (!db) return [];
    return await db.getAllAsync('SELECT * FROM pending_logs WHERE status = ?', 'PENDING');
};

export const savePendingLog = async (id, rawText) => {
    if (!db) return;
    const ts = Date.now();
    await db.runAsync('INSERT INTO pending_logs (id, rawText, timestamp, status) VALUES (?, ?, ?, ?)', [id, rawText, ts, 'PENDING']);
};

export const markPendingLogResolved = async (id) => {
    if (!db) return;
    await db.runAsync('UPDATE pending_logs SET status = ? WHERE id = ?', ['RESOLVED', id]);
};

export const saveTransaction = async (txData) => {
    if (!db) return;
    const { id, customerName, items, paymentStatus, totalAmount, timestamp } = txData;
    
    // items is an array, we store as JSON string
    const itemsStr = JSON.stringify(items || []);
    const ts = timestamp || Date.now();

    await db.runAsync(
        'INSERT INTO transactions (id, customerName, items, paymentStatus, totalAmount, timestamp, is_synced) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, customerName, itemsStr, paymentStatus, totalAmount, ts, 0] // 0 meaning not synced
    );
};

export const getTransactions = async () => {
    if (!db) return [];
    const rows = await db.getAllAsync('SELECT * FROM transactions ORDER BY timestamp DESC');
    return rows.map(r => ({ ...r, items: JSON.parse(r.items) }));
};

export const markTransactionSynced = async (id) => {
    if (!db) return;
    await db.runAsync('UPDATE transactions SET is_synced = 1 WHERE id = ?', [id]);
};
