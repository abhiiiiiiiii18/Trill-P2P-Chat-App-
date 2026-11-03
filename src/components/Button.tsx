import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Fonts, Radius } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  minHeight?: number;
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  minHeight = 52,
}) => {
  const containerStyle = [
    styles.base,
    { minHeight },
    styles[variant],
    disabled ? styles.disabled : undefined,
    style,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.white : Colors.teal}
          size="small"
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles], textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    letterSpacing: 0.2,
  },
  // Variants
  primary: {
    backgroundColor: Colors.orange,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryText: {
    color: Colors.white,
  },
  secondary: {
    backgroundColor: Colors.teal,
  },
  secondaryText: {
    color: Colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ghostText: {
    color: Colors.ink,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.ink,
  },
  dangerText: {
    color: Colors.ink,
  },
  disabled: {
    opacity: 0.4,
  },
});
