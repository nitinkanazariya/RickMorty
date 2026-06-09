import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: c.overlay },
    sheet: {
      backgroundColor: c.surfaceElevated,
      borderTopLeftRadius: radii.xl + 4,
      borderTopRightRadius: radii.xl + 4,
      padding: spacing.xxl,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: c.border,
    },
    handle: {
      width: 40, height: 4, backgroundColor: c.accent,
      borderRadius: radii.full, alignSelf: 'center', marginBottom: spacing.xl, opacity: 0.7,
    },
    title: { color: c.textPrimary, fontSize: typography.xl, fontWeight: '800', marginBottom: spacing.xl },
    label: { color: c.textMuted, fontSize: typography.sm, fontWeight: '600', marginBottom: spacing.sm, letterSpacing: 0.8, textTransform: 'uppercase' },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radii.full, backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.border },
    chipActive: { backgroundColor: c.accentDim, borderColor: c.accent },
    chipText: { color: c.textMuted, fontSize: typography.sm, fontWeight: '600' },
    chipTextActive: { color: c.accent, fontWeight: '700' },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
    cancelBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radii.md, backgroundColor: c.surface, alignItems: 'center', borderWidth: 1.5, borderColor: c.border },
    cancelText: { color: c.textMuted, fontWeight: '600' },
    applyBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radii.md, backgroundColor: c.accentDim, alignItems: 'center', borderWidth: 1.5, borderColor: c.accent },
    applyText: { color: c.accent, fontWeight: '800' },
  });
}
