import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingBottom: spacing.xxxl },
    favBtn: { alignSelf: 'center', width: 110, height: 38, backgroundColor: c.surfaceDeep, borderRadius: radii.full, marginBottom: spacing.xl },
    infoCard: {
      marginHorizontal: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radii.xl,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    name: { height: 22, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '65%' },
    status: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
    gridItem: { width: '45%', gap: 6 },
    label: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '50%' },
    value: { height: 13, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '80%' },
    episodesSection: { paddingHorizontal: spacing.lg, gap: spacing.md },
    sectionTitle: { height: 18, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '45%' },
    chipsRow: { flexDirection: 'row', gap: 10 },
    chip: { width: 110, height: 34, backgroundColor: c.surfaceDeep, borderRadius: radii.md },
  });
}
