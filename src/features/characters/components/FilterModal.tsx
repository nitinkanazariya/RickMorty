import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

interface Props {
  visible: boolean;
  currentStatus: string;
  currentGender: string;
  onApply: (status: string, gender: string) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ['', 'Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['', 'Male', 'Female', 'Genderless', 'unknown'];

function makeStyles(c: Colors) {
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

export default function FilterModal({ visible, currentStatus, currentGender, onApply, onClose }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [status, setStatus] = useState(currentStatus);
  const [gender, setGender] = useState(currentGender);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filter Characters</Text>
          <Text style={styles.label}>Status</Text>
          <View style={styles.options}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity key={opt || 'any-status'} style={[styles.chip, status === opt && styles.chipActive]} onPress={() => setStatus(opt)}>
                <Text style={[styles.chipText, status === opt && styles.chipTextActive]}>{opt || 'Any'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.options}>
            {GENDER_OPTIONS.map(opt => (
              <TouchableOpacity key={opt || 'any-gender'} style={[styles.chip, gender === opt && styles.chipActive]} onPress={() => setGender(opt)}>
                <Text style={[styles.chipText, gender === opt && styles.chipTextActive]}>{opt || 'Any'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(status, gender)}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
