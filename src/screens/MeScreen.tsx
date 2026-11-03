import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { Avatar } from '../components/Avatar';
import { getDeviceName, getSettings, saveSettings, clearAllChats } from '../services/storage';
import { AppSettings } from '../types';

export const MeScreen: React.FC = () => {
  const [deviceName, setDeviceNameState] = useState('');
  const [settings, setSettings] = useState<AppSettings>({
    discoverable: true,
    encryptMessages: true,
    autoAcceptFiles: false,
  });

  useEffect(() => {
    getDeviceName().then(n => setDeviceNameState(n || 'My Device'));
    getSettings().then(s => setSettings(s));
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      await saveSettings(updated);
    },
    [settings],
  );

  const handleClearChats = useCallback(() => {
    Alert.alert(
      'Clear all chats?',
      'This will permanently delete all your messages. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllChats();
            Alert.alert('Done', 'All chats have been cleared.');
          },
        },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Me</Text>

        {/* Identity card */}
        <View style={styles.identityCard}>
          <Avatar name={deviceName} size={56} />
          <View style={styles.identityInfo}>
            <Text style={styles.identityName}>{deviceName}</Text>
            <Text style={styles.identitySubtitle}>
              Visible to nearby devices as this name
            </Text>
          </View>
        </View>

        {/* Settings section */}
        <View style={styles.settingsCard}>
          <SettingRow
            label="Discoverable"
            subtitle="Let nearby Trill users find you"
            value={settings.discoverable}
            onToggle={v => updateSetting('discoverable', v)}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            label="Encrypt messages"
            subtitle="Keys are created and kept on this device"
            value={settings.encryptMessages}
            onToggle={v => updateSetting('encryptMessages', v)}
          />
          <View style={styles.settingDivider} />
          <SettingRow
            label="Auto-accept files"
            subtitle="Ask before receiving anything"
            value={settings.autoAcceptFiles}
            onToggle={v => updateSetting('autoAcceptFiles', v)}
          />
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            <Text style={styles.privacyBold}>Your data stays here. </Text>
            Chats are stored only on this phone. No account, no server.
          </Text>
        </View>

        {/* Clear chats */}
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClearChats}
          activeOpacity={0.8}
          accessibilityLabel="Clear all chats"
        >
          <Text style={styles.clearBtnText}>Clear all chats</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Setting Row ──────────────────────────────────────────────────────────────

type SettingRowProps = {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
};

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  subtitle,
  value,
  onToggle,
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingText}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.teal }}
      thumbColor={Colors.white}
      ios_backgroundColor={Colors.border}
      accessibilityLabel={label}
    />
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.extraBold,
    color: Colors.ink,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ink,
    borderRadius: 18,
    padding: Spacing.md,
    gap: 14,
  },
  identityInfo: { flex: 1 },
  identityName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  identitySubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    marginTop: 3,
    lineHeight: 18,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    minHeight: 68,
  },
  settingText: { flex: 1 },
  settingLabel: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.ink,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    marginTop: 2,
    lineHeight: 18,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  privacyNote: {
    backgroundColor: Colors.tealLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.ink,
    lineHeight: 21,
  },
  privacyBold: {
    fontFamily: Fonts.bold,
  },
  clearBtn: {
    borderWidth: 1.5,
    borderColor: Colors.ink,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: Colors.white,
    minHeight: 52,
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.ink,
  },
});
