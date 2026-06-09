import { fetchCharacters, fetchCharacterById, fetchCharactersByIds } from '../characterService';
import apiClient from '../apiClient';
import type { ApiResponse, Character } from '../../types/api';

jest.mock('../apiClient');

const mockedGet = apiClient.get as jest.Mock;

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/rick.png',
  episode: [],
  url: '',
  created: '',
};

describe('characterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCharacters', () => {
    it('calls /character with page and active filters', async () => {
      const mockResponse: ApiResponse<Character> = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [mockCharacter],
      };
      mockedGet.mockResolvedValue({ data: mockResponse });

      const result = await fetchCharacters(1, { name: 'Rick', status: 'Alive' });

      expect(mockedGet).toHaveBeenCalledWith('/character', {
        params: { page: 1, name: 'Rick', status: 'Alive' },
      });
      expect(result.results).toEqual([mockCharacter]);
    });

    it('omits undefined filters from the params object', async () => {
      mockedGet.mockResolvedValue({ data: { info: {}, results: [] } });

      await fetchCharacters(2, {});

      expect(mockedGet).toHaveBeenCalledWith('/character', { params: { page: 2 } });
    });

    it('returns info and results from the response', async () => {
      const mockResponse: ApiResponse<Character> = {
        info: { count: 826, pages: 42, next: 'https://next', prev: null },
        results: [mockCharacter],
      };
      mockedGet.mockResolvedValue({ data: mockResponse });

      const result = await fetchCharacters(1, {});

      expect(result.info.count).toBe(826);
      expect(result.info.pages).toBe(42);
    });
  });

  describe('fetchCharacterById', () => {
    it('fetches a single character by id', async () => {
      mockedGet.mockResolvedValue({ data: mockCharacter });

      const result = await fetchCharacterById(1);

      expect(mockedGet).toHaveBeenCalledWith('/character/1');
      expect(result).toEqual(mockCharacter);
    });
  });

  describe('fetchCharactersByIds', () => {
    it('fetches multiple characters and returns an array', async () => {
      const second: Character = { ...mockCharacter, id: 2, name: 'Morty Smith' };
      mockedGet.mockResolvedValue({ data: [mockCharacter, second] });

      const result = await fetchCharactersByIds([1, 2]);

      expect(mockedGet).toHaveBeenCalledWith('/character/1,2');
      expect(result).toHaveLength(2);
    });

    it('wraps a single-object response in an array', async () => {
      mockedGet.mockResolvedValue({ data: mockCharacter });

      const result = await fetchCharactersByIds([1]);

      expect(result).toEqual([mockCharacter]);
    });
  });
});
