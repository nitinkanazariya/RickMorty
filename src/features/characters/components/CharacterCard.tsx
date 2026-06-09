import React, { useMemo, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import {
  HeartIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from 'react-native-heroicons/solid';
import { useTheme } from '../../../theme/ThemeContext';
import { layout } from '../../../theme';
import type { Character } from '../../../types/api';
import { strings } from '../../../constants/strings';
import { makeStyles } from './CharacterCard.style';

interface Props {
  character: Character;
  onPress: () => void;
}

const STATUS_META = {
  Alive: {
    Icon: HeartIcon,
    label: strings.characters.statusAlive,
    bg: '#00c96c',
    textColor: '#001a0d',
    stripe: '#00ff9d',
  },
  Dead: {
    Icon: XCircleIcon,
    label: strings.characters.statusDead,
    bg: '#c41c3c',
    textColor: '#ffeaef',
    stripe: '#ff1e5c',
  },
  unknown: {
    Icon: QuestionMarkCircleIcon,
    label: strings.characters.statusUnknown,
    bg: '#6d28d9',
    textColor: '#f0e6ff',
    stripe: '#a855f7',
  },
};

const SharedView = View as React.ComponentType<
  React.ComponentProps<typeof View> & { sharedTransitionTag?: string }
>;

export default function CharacterCard({ character, onPress }: Props) {
  const { colors, shadows } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const size = layout.cardImageSize;
  const scale = useRef(new Animated.Value(1)).current;

  const meta = STATUS_META[character.status as keyof typeof STATUS_META] ?? STATUS_META.unknown;
  const { Icon, label, bg, textColor, stripe } = meta;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 180,
      friction: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.statusStripe, { backgroundColor: stripe }]} />

        <SharedView
          style={[styles.imageWrapper, { width: size, height: size }]}
          sharedTransitionTag={`char-img-${character.id}`}
        >
          {!imageLoaded && (
            <View style={[styles.imagePlaceholder, { width: size, height: size }]} />
          )}
          <Image
            source={{ uri: character.image }}
            style={[{ width: size, height: size }, !imageLoaded && styles.hidden]}
            onLoad={() => setImageLoaded(true)}
          />
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: bg }]}>
              <Icon size={9} color={textColor} />
              <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
            </View>
          </View>
        </SharedView>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
          <Text style={styles.species} numberOfLines={1}>{character.species}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>{strings.characters.lastSeen}</Text>
          <Text style={styles.locationText} numberOfLines={2}>{character.location.name}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
