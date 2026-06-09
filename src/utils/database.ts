import { open } from '@op-engineering/op-sqlite';
import type { OPSQLiteConnection } from '@op-engineering/op-sqlite';
import type { Character } from '../types/api';

let db: OPSQLiteConnection | null = null;

function getDb(): OPSQLiteConnection {
  if (!db) {
    db = open({ name: 'rickmorty.db' });
  }
  return db;
}

export const initDatabase = () => {
  getDb().execute(`
    CREATE TABLE IF NOT EXISTS favourites (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);
};

export const getAllFavourites = async (): Promise<Character[]> => {
  const result = getDb().execute('SELECT data FROM favourites');
  return (result.rows ?? []).map(row => JSON.parse(row.data as string) as Character);
};

export const insertFavourite = async (character: Character): Promise<void> => {
  getDb().execute('INSERT OR REPLACE INTO favourites (id, data) VALUES (?, ?)', [
    character.id,
    JSON.stringify(character),
  ]);
};

export const removeFavourite = async (id: number): Promise<void> => {
  getDb().execute('DELETE FROM favourites WHERE id = ?', [id]);
};
