// @/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

// MODIFIED: This component is now simpler, with no text.
const TabIcon = ({ iconName, focused }: { iconName: any; focused: boolean }) => {
    const activeClasses = focused ? 'bg-brand-blue' : 'bg-transparent';
    const iconColor = focused ? 'white' : '#A0AEC0';
  
    return (
      // MODIFIED: The container now just centers the icon.
      <View className="items-center justify-center">
        {/* MODIFIED: Made the active state container slightly larger and icon bigger for better visibility */}
        <View className={`w-14 h-10 rounded-full justify-center items-center ${activeClasses}`}>
            <FontAwesome name={iconName} size={22} color={iconColor} />
        </View>
      </View>
    );
};
  
export default function TabsLayout() {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false, // Label is already false, but we've removed the text component now.
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            // MODIFIED: A shorter tab bar looks better for an icon-only layout.
            height: 65, 
            shadowOpacity: 0.1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon iconName="home" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="assessment"
          options={{
            title: 'Progress',
            tabBarIcon: ({ focused }) => <TabIcon iconName="line-chart" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ focused }) => <TabIcon iconName="trophy" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon iconName="user" focused={focused} />,
          }}
        />
      </Tabs>
    );
}