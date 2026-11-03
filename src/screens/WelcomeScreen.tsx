import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { Button } from '../components/Button';
import { getDeviceName, setDeviceName } from '../services/storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [deviceName, setDeviceNameState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animations
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if name is already saved
    getDeviceName().then(name => {
      if (name) {
        navigation.replace('Main');
      }
    });

    // Entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing rings
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );
    pulse(ring1, 0).start();
    pulse(ring2, 1000).start();
  }, [logoScale, logoOpacity, contentOpacity, ring1, ring2, navigation]);

  const handleStart = async () => {
    const trimmed = deviceName.trim();
    if (!trimmed) {
      setError('Please enter a name for your device');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setLoading(true);
    await setDeviceName(trimmed);
    setLoading(false);
    navigation.replace('Main');
  };

  const ringStyle = (anim: Animated.Value) => ({
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.4] }) }],
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.7, 0.3, 0] }),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Logo section */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }], opacity: logoOpacity },
              ]}
            >
              {/* Pulsing rings behind logo */}
              <Animated.View style={[styles.pulseRing, ringStyle(ring1)]} />
              <Animated.View style={[styles.pulseRing, ringStyle(ring2)]} />

              {/* Logo circle */}
              <View style={styles.logoBg}>
                {/* Radar icon made from concentric arcs */}
                <View style={styles.radarOuter} />
                <View style={styles.radarMid} />
                <View style={styles.radarInner} />
                <View style={styles.radarDot} />
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: logoOpacity }}>
              <Text style={styles.appName}>Trill</Text>
              <Text style={styles.tagline}>Chat without the cloud</Text>
            </Animated.View>
          </View>

          {/* Input section */}
          <Animated.View style={[styles.card, { opacity: contentOpacity }]}>
            <Text style={styles.cardTitle}>What should we call this device?</Text>
            <Text style={styles.cardSubtitle}>
              This name is shown to nearby peers. You can change it later.
            </Text>

            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="e.g. Abhi's Phone"
              placeholderTextColor={Colors.muted}
              value={deviceName}
              onChangeText={v => {
                setDeviceNameState(v);
                setError('');
              }}
              autoFocus
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              label="Start chatting"
              onPress={handleStart}
              loading={loading}
              style={styles.button}
            />
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
            <View style={styles.dot} />
            <Text style={styles.footerText}>
              No account · No server · Stays on your device
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.teal,
  },
  logoBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarOuter: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    opacity: 0.5,
  },
  radarMid: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    opacity: 0.7,
  },
  radarInner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    opacity: 0.9,
  },
  radarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
  },
  appName: {
    fontSize: 40,
    fontFamily: Fonts.extraBold,
    color: Colors.ink,
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.ink,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    lineHeight: 20,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.ink,
    backgroundColor: Colors.background,
    marginTop: 4,
  },
  inputError: {
    borderColor: '#E05252',
  },
  errorText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#E05252',
  },
  button: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.teal,
  },
  footerText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
  },
});
