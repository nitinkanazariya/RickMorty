import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const isTablet = width >= 768;

export const lightColors = {
  background: '#f0fdfa',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceDeep: '#ccfbf1',
  border: '#5eead4',
  accent: '#059669',
  accentDim: '#d1fae5',
  accentBlue: '#0ea5e9',
  textPrimary: '#0f172a',
  textSecondary: '#1e293b',
  textMuted: '#475569',
  textDisabled: '#64748b',
  textDimmed: '#94a3b8',
  textFaint: '#cbd5e1',
  statusAlive: '#16a34a',
  statusDead: '#e11d48',
  statusUnknown: '#8b5cf6',
  error: '#e11d48',
  overlay: 'rgba(15,23,42,0.70)',
};

export const darkColors = {
  background: '#04060e',
  surface: '#080e1e',
  surfaceElevated: '#0c1428',
  surfaceDeep: '#020408',
  border: '#0e2040',
  accent: '#00ffe1',
  accentDim: '#00ffe114',
  accentBlue: '#c084fc',
  textPrimary: '#e0f2ff',
  textSecondary: '#7ab4d4',
  textMuted: '#3d6480',
  textDisabled: '#1e3a52',
  textDimmed: '#112030',
  textFaint: '#080f1a',
  statusAlive: '#00ff9d',
  statusDead: '#ff1e5c',
  statusUnknown: '#a855f7',
  error: '#ff1e5c',
  overlay: 'rgba(4,6,14,0.94)',
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

export const lightShadows = {
  card: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  accent: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const darkShadows = {
  card: {
    shadowColor: '#00ffe1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  accent: {
    shadowColor: '#00ffe1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 14,
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

