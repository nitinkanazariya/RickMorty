import apiClient from './apiClient';
import type { ApiResponse, Character, CharacterFilters } from '../types/api';

export const fetchCharacters = async (page: number, filters: CharacterFilters): Promise<ApiResponse<Character>> => {
  const params: Record<string, string | number> = { page };
  if (filters.name) params.name = filters.name;
  if (filters.status) params.status = filters.status;
  if (filters.species) params.species = filters.species;
  if (filters.gender) params.gender = filters.gender;

  const { data } = await apiClient.get<ApiResponse<Character>>('/character', { params });
  return data;
};

export const fetchCharacterById = async (id: number): Promise<Character> => {
  const { data } = await apiClient.get<Character>(`/character/${id}`);
  return data;
};

export const fetchCharactersByIds = async (ids: number[]): Promise<Character[]> => {
  const { data } = await apiClient.get<Character[]>(`/character/${ids.join(',')}`);
  return Array.isArray(data) ? data : [data];
};
