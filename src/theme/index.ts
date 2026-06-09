import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const isTablet = width >= 768;

export const colors = {
  background: '#060c1a',
  surface: '#0d1e3d',
  surfaceElevated: '#0f2455',
  surfaceDeep: '#07102a',
  border: '#1e3a6e',

  accent: '#39ff14',
  accentDim: '#1a8a06',
  accentBlue: '#00d4ff',

  textPrimary: '#f0f8ff',
  textSecondary: '#a8c8e8',
  textMuted: '#5a7a9a',
  textDisabled: '#3a5a7a',
  textDimmed: '#2a4060',
  textFaint: '#1a2e48',

  statusAlive: '#39ff14',
  statusDead: '#ff4444',
  statusUnknown: '#8899aa',

  error: '#ff4444',
  overlay: 'rgba(6,12,26,0.88)',
};

export const typography = {
  xs: isTablet ? 12 : 11,
  sm: isTablet ? 13 : 12,
  base: isTablet ? 15 : 14,
  md: isTablet ? 16 : 15,
  lg: isTablet ? 17 : 16,
  xl: isTablet ? 19 : 17,
  xxl: isTablet ? 22 : 20,
  xxxl: isTablet ? 25 : 22,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  accent: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
};

export const layout = {
  locationColumns: isTablet ? 3 : 2,
  residentColumns: isTablet ? 5 : 3,
  episodeAvatarSize: isTablet ? 44 : 36,
  cardImageSize: isTablet ? 130 : 100,
  detailAvatarSize: isTablet ? 230 : 180,
  episodeChipWidth: isTablet ? 160 : 130,
  headerHeight: 60,
};

export const statusColors: Record<string, string> = {
  Alive: colors.statusAlive,
  Dead: colors.statusDead,
  unknown: colors.statusUnknown,
};
