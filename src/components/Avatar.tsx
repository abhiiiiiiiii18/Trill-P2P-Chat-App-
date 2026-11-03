import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme';

type Props = {
  name: string;
  size?: number;
  color?: string;
  textColor?: string;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const getColorFromName = (name: string): string => {
  const palette = [
    '#9B8DC8',
    '#4AA9AD',
    '#86C9A4',
    '#F5B8A0',
    '#7EC8C8',
    '#FFB347',
    '#B5A4D9',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

export const Avatar: React.FC<Props> = ({
  name,
  size = 44,
  color,
  textColor = Colors.white,
}) => {
  const bg = color || getColorFromName(name);
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.initial, { fontSize, color: textColor }]}>
        {getInitial(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
});
