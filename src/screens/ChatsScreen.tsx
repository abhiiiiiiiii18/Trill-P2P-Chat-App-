import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Peer, Conversation } from '../types';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { Avatar } from '../components/Avatar';
import { MOCK_PEERS } from '../services/p2p';
import { getMessages } from '../services/storage';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (ts: number): string => {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 6) return new Date(ts).toLocaleDateString();
  if (days === 1) return 'Yesterday';
  if (days > 1) return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(ts).getDay()];
  if (hours > 0) {
    const h = new Date(ts).getHours();
    const m = new Date(ts).getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
  }
  if (mins > 0) return `${mins}m ago`;
  return 'Now';
};

export const ChatsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    // Build conversations from known peers + their messages
    const convs: Conversation[] = await Promise.all(
      MOCK_PEERS.map(async (peer, idx) => {
        const messages = await getMessages(peer.id);
        // Inject mock data if no real messages exist
        const mockMessages = MOCK_LAST_MESSAGES[idx];
        if (messages.length === 0) {
          return {
            peer,
            lastMessage: mockMessages.text,
            lastTimestamp: Date.now() - mockMessages.ago,
            unreadCount: mockMessages.unread,
          };
        }
        const last = messages[messages.length - 1];
        const unread = messages.filter(m => !m.fromMe && m.status !== 'read').length;
        return {
          peer,
          lastMessage: last.fromMe ? `You: ${last.text}` : last.text,
          lastTimestamp: last.timestamp,
          unreadCount: unread,
        };
      }),
    );
    setConversations(convs.sort((a, b) => b.lastTimestamp - a.lastTimestamp));
    setLoading(false);
  }, []);

  const filtered = conversations.filter(c =>
    c.peer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpen = useCallback(
    (peer: Peer) => {
      navigation.navigate('Chat', { peer });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats"
            placeholderTextColor={Colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.peer.id}
        renderItem={({ item }) => (
          <ConversationRow conversation={item} onPress={handleOpen} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Text style={styles.footer}>Messages live only on this phone</Text>
        }
      />
    </SafeAreaView>
  );
};

// ─── Conversation Row ─────────────────────────────────────────────────────────

type RowProps = { conversation: Conversation; onPress: (p: Peer) => void };

const ConversationRow: React.FC<RowProps> = ({ conversation, onPress }) => {
  const { peer, lastMessage, lastTimestamp, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(peer)}
      activeOpacity={0.7}
      accessibilityLabel={`Open chat with ${peer.name}`}
    >
      <Avatar name={peer.name} size={52} color={peer.avatarColor} />
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={[styles.peerName, hasUnread && styles.peerNameBold]}>
            {peer.name}
          </Text>
          <Text style={[styles.time, hasUnread && styles.timeBold]}>
            {formatTime(lastTimestamp)}
          </Text>
        </View>
        <View style={styles.rowBottom}>
          <Text
            style={[styles.preview, hasUnread && styles.previewBold]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LAST_MESSAGES = [
  { text: 'Sent you the build file', ago: 6 * 60000, unread: 2 },
  { text: 'Are you in the lab?', ago: 72 * 60000, unread: 1 },
  { text: 'Okay, see you tomorrow', ago: 28 * 3600000, unread: 0 },
  { text: 'You: Review 2 slides done', ago: 3 * 86400000, unread: 0 },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.ink,
  },
  list: { paddingBottom: 80 },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 76,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    minHeight: 68,
    backgroundColor: Colors.background,
  },
  rowBody: { flex: 1, marginLeft: 12 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  peerName: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.ink,
  },
  peerNameBold: {
    fontFamily: Fonts.semiBold,
  },
  time: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
  },
  timeBold: {
    fontFamily: Fonts.medium,
    color: Colors.ink,
  },
  preview: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    flex: 1,
    marginRight: 8,
  },
  previewBold: {
    fontFamily: Fonts.medium,
    color: Colors.ink,
  },
  badge: {
    backgroundColor: Colors.orange,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    paddingVertical: Spacing.xl,
  },
});
