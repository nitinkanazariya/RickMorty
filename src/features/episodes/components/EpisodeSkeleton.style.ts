import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
    footerContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    card: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: c.surface, borderRadius: radii.md,
      marginBottom: spacing.sm, padding: spacing.md,
      borderWidth: 1.5, borderColor: c.border, gap: spacing.sm,
    },
    tag: { width: 52, height: 22, backgroundColor: c.surfaceDeep, borderRadius: radii.sm },
    lines: { flex: 1, gap: 8 },
    line1: { height: 13, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '70%' },
    line2: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '45%' },
    chevron: { width: 12, height: 12, backgroundColor: c.surfaceDeep, borderRadius: radii.sm },
  });
}
