import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background, paddingHorizontal: spacing.lg },
    backLine: { height: 20, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: 80, marginBottom: spacing.lg },
    card: { backgroundColor: c.surface, borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.xl, gap: spacing.sm },
    cardName: { height: 24, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '75%' },
    cardType: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%' },
    cardDim: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '60%' },
    cardRes: { height: 12, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%', marginTop: spacing.xs },
    sectionTitle: { height: 18, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%', marginBottom: spacing.lg },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    residentItem: { alignItems: 'center', gap: spacing.sm, width: `${Math.floor(100 / layout.residentColumns)}%` },
    circle: { backgroundColor: c.surfaceDeep },
    resName: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: 48 },
  });
}
