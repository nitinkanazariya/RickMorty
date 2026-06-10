import { open } from '@op-engineering/op-sqlite';
import type { Character } from '../types/api';

const db = open({ name: 'rickmorty.db' });

export const initDatabase = (): void => {
  db.executeSync(
    'CREATE TABLE IF NOT EXISTS favourites (id INTEGER PRIMARY KEY, data TEXT NOT NULL)',
  );
};

export const getAllFavourites = (): Character[] => {
  const result = db.executeSync('SELECT data FROM favourites');
  return (result.rows ?? []).map(row => JSON.parse(row.data as string) as Character);
};

export const insertFavourite = (character: Character): void => {
  db.executeSync('INSERT OR IGNORE INTO favourites (id, data) VALUES (?, ?)', [
    character.id,
    JSON.stringify(character),
  ]);
};

export const removeFavourite = (id: number): void => {
  db.executeSync('DELETE FROM favourites WHERE id = ?', [id]);
};
