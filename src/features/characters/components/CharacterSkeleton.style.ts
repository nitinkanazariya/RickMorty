import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
    card: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: c.border,
    },
    accentBar: { width: 4, backgroundColor: c.surfaceDeep },
    image: { backgroundColor: c.surfaceDeep },
    lines: { flex: 1, padding: spacing.md, justifyContent: 'center', gap: spacing.sm },
    line1: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '65%' },
    line2: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%' },
    divider: { height: 1, backgroundColor: c.border },
    line3: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%' },
    line4: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '70%' },
  });
}
