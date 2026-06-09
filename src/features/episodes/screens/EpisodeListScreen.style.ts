import { StyleSheet } from 'react-native';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 11, backgroundColor: c.surfaceElevated },
    header: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      backgroundColor: c.surfaceElevated, borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    headerRow: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, height: 52,
    },
    headerTitle: { color: c.textPrimary, fontSize: typography.xxl, fontWeight: '800', flex: 1 },
    themeBtn: {
      width: 36, height: 36, borderRadius: radii.full, backgroundColor: c.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    tabsRow: {
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm,
    },
    tab: {
      paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full,
      backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.border, marginRight: spacing.sm,
    },
    tabActive: { backgroundColor: c.accent, borderColor: c.accent },
    tabText: { color: c.textDisabled, fontSize: typography.sm, fontWeight: '700' },
    tabTextActive: { color: c.background },
    episodeRow: {
      backgroundColor: c.surface, marginHorizontal: spacing.md, marginBottom: spacing.lg,
      borderRadius: radii.md, padding: spacing.md, borderWidth: 1.5, borderColor: c.border,
      shadowColor: s.card.shadowColor, shadowOffset: s.card.shadowOffset,
      shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    episodeInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    codeTag: {
      backgroundColor: c.accentDim, borderRadius: radii.sm,
      paddingHorizontal: spacing.sm, paddingVertical: 3, borderWidth: 1, borderColor: c.accent,
    },
    episodeCode: { color: c.accent, fontSize: typography.xs, fontWeight: '800' },
    episodeTextBlock: { flex: 1 },
    episodeName: { color: c.textPrimary, fontSize: typography.base, fontWeight: '700' },
    airDate: { color: c.textDisabled, fontSize: typography.xs, marginTop: 2 },
    avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
    avatarWrapper: { borderRadius: radii.full, borderWidth: 2, borderColor: c.border, overflow: 'hidden' },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: {
      backgroundColor: c.accentDim, paddingHorizontal: spacing.xxl, paddingVertical: 10,
      borderRadius: radii.full, borderWidth: 1.5, borderColor: c.accent,
    },
    retryText: { color: c.accent, fontWeight: '700' },
  });
}

export type EpisodeListStyles = ReturnType<typeof makeStyles>;
