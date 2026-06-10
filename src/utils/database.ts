import { open } from '@op-engineering/op-sqlite';
import type { Character } from '../types/api';

const db = open({ name: 'rickmorty.db' });

export const initDatabase = (): void => {
  db.execute(
    'CREATE TABLE IF NOT EXISTS favourites (id INTEGER PRIMARY KEY, data TEXT NOT NULL)',
  );
};

export const getAllFavourites = (): Character[] => {
  const result = db.execute('SELECT data FROM favourites');
  return (result.rows?._array ?? []).map(row => JSON.parse(row.data) as Character);
};

export const insertFavourite = (character: Character): void => {
  db.execute('INSERT OR IGNORE INTO favourites (id, data) VALUES (?, ?)', [
    character.id,
    JSON.stringify(character),
  ]);
};

export const removeFavourite = (id: number): void => {
  db.execute('DELETE FROM favourites WHERE id = ?', [id]);
};
