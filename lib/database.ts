// src/lib/database.ts
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database,
});

export async function initializeDatabase() {
  const db = await dbPromise;
  // Add a table for uploaded images
  await db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      path TEXT NOT NULL,
      content TEXT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

initializeDatabase();