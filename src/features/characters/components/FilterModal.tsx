import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { strings } from '../../../constants/strings';
import { makeStyles } from './FilterModal.style';

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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [status, setStatus] = useState(currentStatus);
  const [gender, setGender] = useState(currentGender);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{strings.filter.title}</Text>
          <Text style={styles.label}>{strings.filter.labelStatus}</Text>
          <View style={styles.options}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity key={opt || 'any-status'} style={[styles.chip, status === opt && styles.chipActive]} onPress={() => setStatus(opt)}>
                <Text style={[styles.chipText, status === opt && styles.chipTextActive]}>{opt || strings.common.any}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>{strings.filter.labelGender}</Text>
          <View style={styles.options}>
            {GENDER_OPTIONS.map(opt => (
              <TouchableOpacity key={opt || 'any-gender'} style={[styles.chip, gender === opt && styles.chipActive]} onPress={() => setGender(opt)}>
                <Text style={[styles.chipText, gender === opt && styles.chipTextActive]}>{opt || strings.common.any}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{strings.filter.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(status, gender)}>
              <Text style={styles.applyText}>{strings.filter.apply}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
