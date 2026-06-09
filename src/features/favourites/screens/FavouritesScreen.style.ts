import { StyleSheet } from 'react-native';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      backgroundColor: c.surfaceElevated, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    headerTitle: { color: c.textPrimary, fontSize: typography.xxl, fontWeight: '800', flex: 1 },
    themeBtn: {
      width: 36, height: 36, borderRadius: radii.full, backgroundColor: c.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    list: { padding: spacing.md },
    card: {
      flexDirection: 'row', backgroundColor: c.surface, borderRadius: radii.lg,
      marginBottom: spacing.md, overflow: 'hidden', alignItems: 'center',
      borderWidth: 1.5, borderColor: c.border, ...s.card,
    },
    accentBar: { width: 4, alignSelf: 'stretch' },
    avatar: { width: 80, height: 80, backgroundColor: c.surfaceDeep },
    info: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: spacing.xs },
    statusPill: {
      flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4,
      borderRadius: radii.full, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: spacing.xs,
    },
    dot: { width: 6, height: 6, borderRadius: radii.full },
    statusText: { fontSize: typography.xs, fontWeight: '700' },
    species: { color: c.accentBlue, fontSize: typography.xs, fontWeight: '600', marginBottom: 2 },
    location: { color: c.textDisabled, fontSize: typography.xs },
    removeBtn: { padding: spacing.lg },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background, padding: spacing.xxxl, gap: spacing.lg },
    emptyTitle: { color: c.textMuted, fontSize: typography.xxl, fontWeight: '800' },
    emptySubtitle: { color: c.textMuted, fontSize: typography.base, textAlign: 'center' },
  });
}
