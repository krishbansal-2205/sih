import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text } from 'react-native';

const TabIcon = ({ iconName, label, focused }: { iconName: any; label: string; focused: boolean }) => {
    const activeClasses = focused ? 'bg-brand-blue' : '';
    const iconColor = focused ? 'white' : '#A0AEC0';
    const textColor = focused ? 'text-brand-blue' : 'text-gray-400';
  
    return (
      <View className="items-center justify-center gap-1 pt-2">
        <View className={`w-12 h-8 rounded-full justify-center items-center ${activeClasses}`}>
            <FontAwesome name={iconName} size={20} color={iconColor} />
        </View>
        <Text className={`text-xs font-semibold ${textColor}`}>{label}</Text>
      </View>
    );
};
  
export default function TabsLayout() {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            height: 70,
            shadowOpacity: 0.1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon iconName="home" label="Home" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="assessment"
          options={{
            title: 'Progress',
            tabBarIcon: ({ focused }) => <TabIcon iconName="line-chart" label="Progress" focused={focused} />,
          }}
        />
        {/* MODIFICATION: Add the new Leaderboard screen here */}
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ focused }) => <TabIcon iconName="trophy" label="Leaderboard" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon iconName="user" label="Profile" focused={focused} />,
          }}
        />
      </Tabs>
    );
}