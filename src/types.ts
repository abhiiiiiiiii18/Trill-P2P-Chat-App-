export type Peer = {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  distance?: string; // e.g. "8 m away"
  lastSeen?: string;
  avatarColor?: string;
};

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type Message = {
  id: string;
  peerId: string;
  text: string;
  fromMe: boolean;
  timestamp: number; // Unix ms
  status?: MessageStatus;
};

export type Conversation = {
  peer: Peer;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
};

export type AppSettings = {
  discoverable: boolean;
  encryptMessages: boolean;
  autoAcceptFiles: boolean;
};

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Chat: { peer: Peer };
};

export type BottomTabParamList = {
  Nearby: undefined;
  Chats: undefined;
  Me: undefined;
};
