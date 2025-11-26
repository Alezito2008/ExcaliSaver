import 'dotenv/config'
import Database from 'better-sqlite3';

const DB_FILE = process.env.DB_FILE || 'excalisaver.db';

const db = new Database(DB_FILE);

db.exec(`
    CREATE TABLE IF NOT EXISTS saves (
        id TEXT PRIMARY KEY,
        title TEXT,
        created INTEGER,
        modified INTEGER,
        data TEXT
    );
`);

export default db;
