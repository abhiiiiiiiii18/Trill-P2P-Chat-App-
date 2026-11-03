export const Colors = {
  teal: '#4AA9AD',
  tealDark: '#10282B',
  tealLight: '#E0F0F1',
  orange: '#FF9150',
  ink: '#10282B',
  background: '#F3F7F6',
  white: '#FFFFFF',
  border: '#DDE8E6',
  muted: '#4F6A6C',
  bubbleMine: '#10282B',
  bubbleTheirs: '#FFFFFF',
  success: '#4AA9AD',
  unreadBadge: '#FF9150',
};

export const Fonts = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 28, fontFamily: Fonts.extraBold, color: Colors.ink },
  h2: { fontSize: 22, fontFamily: Fonts.bold, color: Colors.ink },
  h3: { fontSize: 18, fontFamily: Fonts.semiBold, color: Colors.ink },
  body: { fontSize: 15, fontFamily: Fonts.regular, color: Colors.ink },
  bodyMed: { fontSize: 15, fontFamily: Fonts.medium, color: Colors.ink },
  small: { fontSize: 13, fontFamily: Fonts.regular, color: Colors.muted },
  smallMed: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.muted },
  caption: { fontSize: 11, fontFamily: Fonts.regular, color: Colors.muted },
};

export const Shadows = {
  card: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
