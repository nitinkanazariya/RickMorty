import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.lg, paddingBottom: spacing.sm,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backText: { color: c.accent, fontSize: typography.lg },
    starBtn: { padding: spacing.sm },
    imageWrapper: { alignItems: 'center', marginVertical: spacing.lg },
    avatarRing: { overflow: 'hidden', borderWidth: 3, borderColor: c.accent },
    infoCard: {
      marginHorizontal: spacing.lg, backgroundColor: c.surface,
      borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.xl,
    },
    characterName: { color: c.textPrimary, fontSize: typography.xxxl, fontWeight: '800', marginBottom: spacing.sm },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    dot: { width: 10, height: 10, borderRadius: radii.full, marginRight: spacing.sm },
    statusText: { color: c.textMuted, fontSize: typography.base },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    gridItem: { width: '45%' },
    gridLabel: { color: c.textDisabled, fontSize: typography.sm, marginBottom: 2 },
    gridValue: { color: c.textSecondary, fontSize: typography.base, fontWeight: '500' },
    episodesSection: { marginBottom: spacing.xxxl },
    sectionTitle: { color: c.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: { backgroundColor: c.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
    retryText: { color: c.textPrimary, fontWeight: '600' },
  });
}
