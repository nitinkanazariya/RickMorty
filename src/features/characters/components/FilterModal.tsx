import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 20 },
  label: { color: '#9ca3af', fontSize: 13, marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  chipActive: { backgroundColor: '#00b4d8', borderColor: '#00b4d8' },
  chipText: { color: '#9ca3af', fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  cancelText: { color: '#9ca3af', fontWeight: '600' },
  applyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#00b4d8',
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: '700' },
});
