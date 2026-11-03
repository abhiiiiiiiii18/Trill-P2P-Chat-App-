import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Message } from '../types';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { Avatar } from '../components/Avatar';
import { getMessages, addMessage } from '../services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const formatBubbleTime = (ts: number): string => {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { peer } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadMessages();
  }, [navigation]);

  const loadMessages = async () => {
    const stored = await getMessages(peer.id);
    if (stored.length === 0) {
      // Inject mock conversation
      setMessages(MOCK_MESSAGES(peer.id));
    } else {
      setMessages(stored);
    }
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');
    const msg: Message = {
      id: `msg-${Date.now()}`,
      peerId: peer.id,
      text,
      fromMe: true,
      timestamp: Date.now(),
      status: 'sent',
    };
    const updated = await addMessage(peer.id, msg);
    setMessages(updated);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    // Simulate delivery tick after 800ms
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === msg.id ? { ...m, status: 'delivered' } : m)),
      );
    }, 800);
    setSending(false);
  }, [input, peer.id, sending]);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const prevItem = messages[index - 1];
      const showAvatar =
        !item.fromMe &&
        (!prevItem || prevItem.fromMe || prevItem.peerId !== item.peerId);
      return (
        <MessageBubble
          message={item}
          showAvatar={showAvatar}
          peerName={peer.name}
          peerColor={peer.avatarColor}
        />
      );
    },
    [messages, peer],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Avatar name={peer.name} size={38} color={peer.avatarColor} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{peer.name}</Text>
          <Text style={styles.headerSub}>Direct · end-to-end encrypted</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* System note */}
        <View style={styles.systemNote}>
          <Text style={styles.systemNoteText}>
            Connected on same network · no server
          </Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={styles.attachIcon}>＋</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor={Colors.muted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
            accessibilityLabel="Send message"
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

type BubbleProps = {
  message: Message;
  showAvatar: boolean;
  peerName: string;
  peerColor?: string;
};

const MessageBubble: React.FC<BubbleProps> = ({
  message,
  showAvatar,
  peerName,
  peerColor,
}) => {
  const isMe = message.fromMe;

  const statusIcon = isMe
    ? message.status === 'read'
      ? '✓✓'
      : message.status === 'delivered'
      ? '✓✓'
      : '✓'
    : null;

  return (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
      {!isMe && (
        <View style={styles.avatarSlot}>
          {showAvatar && (
            <Avatar name={peerName} size={30} color={peerColor} />
          )}
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleThem,
        ]}
      >
        <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
          {message.text}
        </Text>
        <View style={styles.bubbleMeta}>
          <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
            {formatBubbleTime(message.timestamp)}
          </Text>
          {statusIcon && (
            <Text
              style={[
                styles.tick,
                message.status === 'read' && styles.tickRead,
              ]}
            >
              {statusIcon}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── Mock conversation ────────────────────────────────────────────────────────

const MOCK_MESSAGES = (peerId: string): Message[] => {
  const base = Date.now() - 30 * 60000;
  return [
    {
      id: 'm1',
      peerId,
      text: 'Hey! Found you on the lab Wi-Fi',
      fromMe: false,
      timestamp: base,
      status: 'read',
    },
    {
      id: 'm2',
      peerId,
      text: 'Nice, no internet needed right?',
      fromMe: true,
      timestamp: base + 60000,
      status: 'read',
    },
    {
      id: 'm3',
      peerId,
      text: 'Nope, straight device to device',
      fromMe: false,
      timestamp: base + 120000,
      status: 'read',
    },
    {
      id: 'm4',
      peerId,
      text: 'Sending the build file now',
      fromMe: false,
      timestamp: base + 180000,
      status: 'read',
    },
    {
      id: 'm5',
      peerId,
      text: 'Got it, installing',
      fromMe: true,
      timestamp: base + 240000,
      status: 'delivered',
    },
  ];
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ink,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 10,
    minHeight: 60,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: Colors.white,
    marginTop: -4,
    lineHeight: 36,
  },
  headerInfo: { flex: 1 },
  headerName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.teal,
    marginTop: 1,
  },
  systemNote: {
    alignSelf: 'center',
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginVertical: Spacing.md,
  },
  systemNoteText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.muted,
  },
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 3,
    maxWidth: '85%',
  },
  bubbleRowMe: {
    alignSelf: 'flex-end',
  },
  bubbleRowThem: {
    alignSelf: 'flex-start',
  },
  avatarSlot: {
    width: 34,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginRight: 6,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '90%',
  },
  bubbleMe: {
    backgroundColor: Colors.bubbleMine,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  bubbleTextMe: { color: Colors.white },
  bubbleTextThem: { color: Colors.ink },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.muted,
  },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.5)' },
  tick: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -1,
  },
  tickRead: { color: Colors.teal },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: {
    fontSize: 22,
    color: Colors.muted,
    lineHeight: 26,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.ink,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: Colors.white,
  },
});
