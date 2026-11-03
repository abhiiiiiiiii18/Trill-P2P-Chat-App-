/**
 * p2p.ts — Stub for future Wi-Fi Direct / BLE peer discovery.
 * Phase 1 uses mock data. Phase 2 will replace these with real transport.
 */
import { Peer } from '../types';

export const MOCK_PEERS: Peer[] = [
  {
    id: 'peer-manas',
    name: "Manas's Pixel",
    status: 'online',
    distance: '8 m away',
    avatarColor: '#9B8DC8',
  },
  {
    id: 'peer-sathi',
    name: "Sathi's Galaxy",
    status: 'online',
    distance: '15 m away',
    avatarColor: '#4AA9AD',
  },
  {
    id: 'peer-uday',
    name: "Uday's Redmi",
    status: 'online',
    distance: '22 m away',
    avatarColor: '#86C9A4',
  },
  {
    id: 'peer-menhaz',
    name: "Menhaz's Realme",
    status: 'away',
    distance: '34 m away',
    avatarColor: '#F5B8A0',
  },
];

// Stub: will be replaced with actual P2P transport
export const startDiscovery = async (): Promise<void> => {
  console.log('[P2P] Discovery started (stub)');
};

export const stopDiscovery = async (): Promise<void> => {
  console.log('[P2P] Discovery stopped (stub)');
};

export const sendMessage = async (
  peerId: string,
  text: string,
): Promise<void> => {
  console.log(`[P2P] Sending to ${peerId}: ${text} (stub)`);
};
