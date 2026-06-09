import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
    backText: { color: c.accent, fontSize: typography.lg },
    infoCard: {
      margin: spacing.lg, backgroundColor: c.surface,
      borderRadius: radii.xl, padding: spacing.xl, gap: spacing.sm,
    },
    name: { color: c.textPrimary, fontSize: typography.xxxl, fontWeight: '800' },
    type: { color: c.accent, fontSize: typography.base },
    dimension: { color: c.textMuted, fontSize: typography.base },
    residents: { color: c.textDisabled, fontSize: typography.sm, marginTop: spacing.xs },
    sectionTitle: { color: c.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    row: { gap: 10, marginBottom: 10 },
    residentCard: { flex: 1, alignItems: 'center' },
    avatar: { backgroundColor: c.surface, marginBottom: spacing.sm },
    residentName: { color: c.textSecondary, fontSize: typography.xs, textAlign: 'center' },
    noResidentsWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl * 2 },
    noResidents: { color: c.textMuted, fontSize: typography.xxl, fontWeight: '600', textAlign: 'center' },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: { backgroundColor: c.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
    retryText: { color: c.textPrimary, fontWeight: '600' },
  });
}
