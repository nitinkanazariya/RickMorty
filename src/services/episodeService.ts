import apiClient from './apiClient';
import type { ApiResponse, Episode } from '../types/api';

export const fetchEpisodes = async (page: number): Promise<ApiResponse<Episode>> => {
  const { data } = await apiClient.get<ApiResponse<Episode>>('/episode', { params: { page } });
  return data;
};

export const fetchEpisodeById = async (id: number): Promise<Episode> => {
  const { data } = await apiClient.get<Episode>(`/episode/${id}`);
  return data;
};
