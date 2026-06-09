import apiClient from '../src/services/apiClient';
import { fetchCharacters, fetchCharacterById } from '../src/services/characterService';
import type { Character, ApiResponse } from '../src/types/api';

jest.mock('../src/services/apiClient');

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: '',
  episode: [],
  url: '',
  created: '',
};

describe('characterService', () => {
  afterEach(() => jest.clearAllMocks());

  it('fetchCharacters returns paginated results', async () => {
    const response: ApiResponse<Character> = {
      info: { count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null },
      results: [mockCharacter],
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: response });

    const result = await fetchCharacters(1, { name: 'Rick' });
    expect(result.results).toHaveLength(1);
    expect(result.info.pages).toBe(42);
    expect(apiClient.get).toHaveBeenCalledWith('/character', {
      params: { page: 1, name: 'Rick' },
    });
  });

  it('fetchCharacterById returns a single character', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockCharacter });

    const result = await fetchCharacterById(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Rick Sanchez');
    expect(apiClient.get).toHaveBeenCalledWith('/character/1');
  });

  it('fetchCharacters passes status filter correctly', async () => {
    const response: ApiResponse<Character> = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [mockCharacter],
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: response });

    await fetchCharacters(1, { status: 'Alive' });
    expect(apiClient.get).toHaveBeenCalledWith('/character', {
      params: { page: 1, status: 'Alive' },
    });
  });
});
