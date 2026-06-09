import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../../../theme';

interface Props {
  visible: boolean;
  currentStatus: string;
  currentGender: string;
  onApply: (status: string, gender: string) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ['', 'Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['', 'Male', 'Female', 'Genderless', 'unknown'];

export default function FilterModal({ visible, currentStatus, currentGender, onApply, onClose }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [gender, setGender] = useState(currentGender);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filter Characters</Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.options}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt || 'any-status'}
                style={[styles.chip, status === opt && styles.chipActive]}
                onPress={() => setStatus(opt)}>
                <Text style={[styles.chipText, status === opt && styles.chipTextActive]}>
                  {opt || 'Any'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Gender</Text>
          <View style={styles.options}>
            {GENDER_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt || 'any-gender'}
                style={[styles.chip, gender === opt && styles.chipActive]}
                onPress={() => setGender(opt)}>
                <Text style={[styles.chipText, gender === opt && styles.chipTextActive]}>
                  {opt || 'Any'}
                </Text>
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

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radii.xl + 4,
    borderTopRightRadius: radii.xl + 4,
    padding: spacing.xxl,
  },
  title: { color: colors.textPrimary, fontSize: typography.xl, fontWeight: '700', marginBottom: spacing.xl },
  label: { color: colors.textMuted, fontSize: typography.sm, marginBottom: spacing.sm },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceDeep,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontSize: typography.sm },
  chipTextActive: { color: colors.textPrimary, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
  applyBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  applyText: { color: colors.textPrimary, fontWeight: '700' },
});
