import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 11, backgroundColor: c.surfaceElevated },
    header: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      backgroundColor: c.surfaceElevated, flexDirection: 'row',
      alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm,
      borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    searchInput: {
      flex: 1, height: 40, backgroundColor: c.surface, borderRadius: radii.full,
      paddingHorizontal: spacing.lg, color: c.textPrimary, fontSize: typography.base,
      borderWidth: 1.5, borderColor: c.border,
    },
    iconBtn: {
      width: 40, height: 40, backgroundColor: c.surface, borderRadius: radii.full,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    footer: { paddingVertical: spacing.lg },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    emptyText: { color: c.textDisabled, fontSize: typography.lg },
    retryBtn: {
      backgroundColor: c.accentDim, paddingHorizontal: spacing.xxl, paddingVertical: 10,
      borderRadius: radii.full, borderWidth: 1.5, borderColor: c.accent,
    },
    retryText: { color: c.accent, fontWeight: '700' },
  });
}
