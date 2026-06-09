import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
    footerWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
    card: { flex: 1, backgroundColor: c.surface, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1.5, borderColor: c.border, gap: spacing.sm },
    name: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '80%' },
    pill: { height: 20, backgroundColor: c.surfaceDeep, borderRadius: radii.full, width: 60 },
    dim: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '70%' },
    res: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%' },
  });
}
