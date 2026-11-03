import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, AppSettings, Peer } from '../types';

const KEYS = {
  DEVICE_NAME: '@trill/device_name',
  MESSAGES_PREFIX: '@trill/messages/',
  SETTINGS: '@trill/settings',
  PEERS: '@trill/known_peers',
};

// ─── Device Name ─────────────────────────────────────────────────────────────

export const getDeviceName = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.DEVICE_NAME);
  } catch {
    return null;
  }
};

export const setDeviceName = async (name: string): Promise<void> => {
  await AsyncStorage.setItem(KEYS.DEVICE_NAME, name);
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const getMessages = async (peerId: string): Promise<Message[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.MESSAGES_PREFIX + peerId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveMessages = async (
  peerId: string,
  messages: Message[],
): Promise<void> => {
  await AsyncStorage.setItem(
    KEYS.MESSAGES_PREFIX + peerId,
    JSON.stringify(messages),
  );
};

export const addMessage = async (
  peerId: string,
  message: Message,
): Promise<Message[]> => {
  const existing = await getMessages(peerId);
  const updated = [...existing, message];
  await saveMessages(peerId, updated);
  return updated;
};

export const clearAllChats = async (): Promise<void> => {
  const allKeys = await AsyncStorage.getAllKeys();
  const chatKeys = allKeys.filter(k => k.startsWith(KEYS.MESSAGES_PREFIX));
  await AsyncStorage.multiRemove(chatKeys);
};

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  discoverable: true,
  encryptMessages: true,
  autoAcceptFiles: false,
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ─── Known Peers (for conversation list) ─────────────────────────────────────

export const getKnownPeers = async (): Promise<Peer[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PEERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveKnownPeer = async (peer: Peer): Promise<void> => {
  const existing = await getKnownPeers();
  const updated = existing.filter(p => p.id !== peer.id);
  await AsyncStorage.setItem(KEYS.PEERS, JSON.stringify([...updated, peer]));
};
