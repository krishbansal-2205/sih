// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Profile</Text>
      <Text className="text-lg text-gray-600 mb-8">{user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress}</Text>
      <Button title="Sign Out" onPress={() => signOut()} color="#ef4444" />
    </View>
  );
}
