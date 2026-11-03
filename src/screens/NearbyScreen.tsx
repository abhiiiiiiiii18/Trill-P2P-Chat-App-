import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Peer } from '../types';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { RadarView } from '../components/RadarView';
import { Avatar } from '../components/Avatar';
import { MOCK_PEERS } from '../services/p2p';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const NearbyScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [peers] = useState<Peer[]>(MOCK_PEERS.slice(0, 3));

  const handleSayHi = useCallback(
    (peer: Peer) => {
      navigation.navigate('Chat', { peer });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nearby</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              Wi-Fi Direct · {peers.length} peers nearby
            </Text>
          </View>
        </View>

        {/* Radar */}
        <RadarView peerCount={peers.length} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Peer list */}
        <View style={styles.peerList}>
          {peers.map(peer => (
            <PeerRow key={peer.id} peer={peer} onPress={handleSayHi} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Peer Row ─────────────────────────────────────────────────────────────────

type PeerRowProps = { peer: Peer; onPress: (p: Peer) => void };

const PeerRow: React.FC<PeerRowProps> = ({ peer, onPress }) => (
  <View style={styles.peerRow}>
    <Avatar name={peer.name} size={48} color={peer.avatarColor} />
    <View style={styles.peerInfo}>
      <Text style={styles.peerName}>{peer.name}</Text>
      <Text style={styles.peerMeta}>
        {peer.distance} · {peer.status}
      </Text>
    </View>
    <TouchableOpacity
      style={styles.sayHiBtn}
      onPress={() => onPress(peer)}
      activeOpacity={0.8}
      accessibilityLabel={`Say hi to ${peer.name}`}
    >
      <Text style={styles.sayHiText}>Say hi</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  content: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.extraBold,
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 6,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
  },
  statusText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  peerList: {
    paddingHorizontal: Spacing.lg,
    gap: 2,
  },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 68,
  },
  peerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  peerName: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.ink,
  },
  peerMeta: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    marginTop: 2,
  },
  sayHiBtn: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sayHiText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
});
