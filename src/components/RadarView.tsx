import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '../theme';

type Props = {
  peerCount?: number;
};

const RADAR_SIZE = 260;
const CENTER = RADAR_SIZE / 2;
const YOU_RADIUS = 30;

// Fixed positions for peer avatars around the radar
const PEER_POSITIONS = [
  { x: CENTER - 80, y: CENTER - 60 },  // top-left  (M)
  { x: CENTER + 65, y: CENTER - 70 },  // top-right (S)
  { x: CENTER - 90, y: CENTER + 55 },  // bot-left  (U)
  { x: CENTER + 60, y: CENTER + 50 },  // bot-right (H)
];

const PEER_COLORS = ['#9B8DC8', '#4AA9AD', '#86C9A4', '#F5B8A0'];
const PEER_INITIALS = ['M', 'S', 'U', 'H'];

export const RadarView: React.FC<Props> = ({ peerCount = 4 }) => {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing rings
    const pulseAnim = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    // Rotating sweep line
    const rotateAnim = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulseAnim(pulse1, 0).start();
    pulseAnim(pulse2, 1200).start();
    rotateAnim.start();
    return () => {
      pulse1.stopAnimation();
      pulse2.stopAnimation();
      rotate.stopAnimation();
    };
  }, [pulse1, pulse2, rotate]);

  const pulseStyle = (anim: Animated.Value) => ({
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.4, 0] }),
  });

  const rotateStyle = {
    transform: [
      {
        rotate: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Outer dashed ring */}
      <View style={styles.ring3} />
      {/* Middle dashed ring */}
      <View style={styles.ring2} />
      {/* Inner solid ring */}
      <View style={styles.ring1} />

      {/* Pulse animations */}
      <Animated.View style={[styles.pulseRing, pulseStyle(pulse1)]} />
      <Animated.View style={[styles.pulseRing, pulseStyle(pulse2)]} />

      {/* Rotating sweep */}
      <Animated.View style={[styles.sweepContainer, rotateStyle]}>
        <View style={styles.sweep} />
      </Animated.View>

      {/* Peer avatars */}
      {PEER_POSITIONS.slice(0, peerCount).map((pos, i) => (
        <View
          key={i}
          style={[
            styles.peerDot,
            {
              left: pos.x - 20,
              top: pos.y - 20,
              backgroundColor: PEER_COLORS[i],
            },
          ]}
        >
          <Text style={styles.peerInitial}>{PEER_INITIALS[i]}</Text>
        </View>
      ))}

      {/* You dot */}
      <View style={styles.youDot}>
        <Text style={styles.youLabel}>You</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 8,
  },
  ring1: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    opacity: 0.4,
  },
  ring2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: Colors.teal,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  ring3: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: Colors.teal,
    borderStyle: 'dashed',
    opacity: 0.2,
  },
  pulseRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    backgroundColor: Colors.teal,
  },
  sweepContainer: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweep: {
    position: 'absolute',
    width: RADAR_SIZE / 2,
    height: 1.5,
    right: CENTER,
    top: CENTER - 0.75,
    backgroundColor: Colors.teal,
    opacity: 0.25,
    transformOrigin: 'right center',
  },
  peerDot: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peerInitial: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  youDot: {
    width: YOU_RADIUS * 2,
    height: YOU_RADIUS * 2,
    borderRadius: YOU_RADIUS,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  youLabel: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
