import apiClient from './apiClient';
import type { ApiResponse, Location } from '../types/api';

export const fetchLocations = async (page: number): Promise<ApiResponse<Location>> => {
  const { data } = await apiClient.get<ApiResponse<Location>>('/location', { params: { page } });
  return data;
};

export const fetchLocationById = async (id: number): Promise<Location> => {
  const { data } = await apiClient.get<Location>(`/location/${id}`);
  return data;
};
