// app/(tabs)/index.tsx
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

export default function DashboardScreen() {
  const { user } = useUser();

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName || 'Athlete'}!</Text>
      <Text className="text-base text-gray-600 mt-2 mb-10">Ready to start your next assessment?</Text>

      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</Text>
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-gray-500">No recent assessments found.</Text>
        </View>
      </View>

      <Link href="/assessment" asChild>
        <TouchableOpacity className="bg-indigo-600 py-4 px-6 rounded-xl flex-row items-center justify-center shadow-lg">
          <FontAwesome name="play-circle" size={20} color="white" />
          <Text className="text-white text-lg font-bold ml-3">Start New Assessment</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
