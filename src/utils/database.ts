import { open } from '@op-engineering/op-sqlite';
import type { Character } from '../types/api';

const db = open({ name: 'rickmorty.db' });

export const initDatabase = () => {
  db.execute(`
    CREATE TABLE IF NOT EXISTS favourites (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);
};

export const getAllFavourites = async (): Promise<Character[]> => {
  const result = db.execute('SELECT data FROM favourites');
  return (result.rows ?? []).map(row => JSON.parse(row.data as string) as Character);
};

export const insertFavourite = async (character: Character): Promise<void> => {
  db.execute('INSERT OR REPLACE INTO favourites (id, data) VALUES (?, ?)', [
    character.id,
    JSON.stringify(character),
  ]);
};

export const removeFavourite = async (id: number): Promise<void> => {
  db.execute('DELETE FROM favourites WHERE id = ?', [id]);
};
