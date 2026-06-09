import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const isTablet = width >= 768;

export const colors = {
  background: '#0f0f1a',
  surface: '#16213e',
  surfaceElevated: '#1a1a2e',
  surfaceDeep: '#0f3460',
  accent: '#00b4d8',

  textPrimary: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textDisabled: '#6b7280',
  textDimmed: '#4b5563',
  textFaint: '#374151',

  statusAlive: '#22c55e',
  statusDead: '#ef4444',
  statusUnknown: '#6b7280',

  error: '#ef4444',
  overlay: 'rgba(0,0,0,0.6)',
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
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
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
