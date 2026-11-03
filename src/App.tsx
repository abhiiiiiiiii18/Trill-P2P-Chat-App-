import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from './types';
import { Colors, Fonts } from './theme';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { NearbyScreen } from './screens/NearbyScreen';
import { ChatsScreen } from './screens/ChatsScreen';
import { ChatScreen } from './screens/ChatScreen';
import { MeScreen } from './screens/MeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// ─── Tab Icons (SVG-lite using Text glyphs) ────────────────────────────────

const NearbyIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <View style={[tabIconStyles.container, focused && tabIconStyles.active]}>
    {/* Concentric circles radar icon */}
    <View style={[tabIconStyles.radarOuter, focused && tabIconStyles.radarOuterActive]} />
    <View style={[tabIconStyles.radarMid, focused && tabIconStyles.radarMidActive]} />
    <View style={[tabIconStyles.radarDot, focused && tabIconStyles.radarDotActive]} />
  </View>
);

const ChatsIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <View style={tabIconStyles.container}>
    <Text style={[tabIconStyles.icon, { color: focused ? Colors.teal : Colors.muted }]}>
      ☐
    </Text>
  </View>
);

const MeIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <View style={tabIconStyles.container}>
    <Text style={[tabIconStyles.icon, { color: focused ? Colors.teal : Colors.muted }]}>
      ♟
    </Text>
  </View>
);

const tabIconStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', width: 28, height: 28 },
  active: {},
  radarOuter: {
    position: 'absolute', width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: Colors.muted,
  },
  radarOuterActive: { borderColor: Colors.teal },
  radarMid: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: Colors.muted,
  },
  radarMidActive: { borderColor: Colors.teal },
  radarDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.muted },
  radarDotActive: { backgroundColor: Colors.teal },
  icon: { fontSize: 22 },
});

// ─── Bottom Tab Navigator ────────────────────────────────────────────────────

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.white,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 64,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontFamily: Fonts.medium,
        fontSize: 11,
        marginTop: 2,
      },
      tabBarActiveTintColor: Colors.teal,
      tabBarInactiveTintColor: Colors.muted,
    }}
  >
    <Tab.Screen
      name="Nearby"
      component={NearbyScreen}
      options={{
        tabBarIcon: ({ focused }) => <NearbyIcon focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Chats"
      component={ChatsScreen}
      options={{
        tabBarIcon: ({ focused }) => <ChatsIcon focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Me"
      component={MeScreen}
      options={{
        tabBarIcon: ({ focused }) => <MeIcon focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// ─── Root Stack ──────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
