import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tests = [
  { id: 'vertical-jump', name: 'Vertical Jump', icon: 'arrow-up' },
  { id: 'shuttle-run', name: 'Shuttle Run', icon: 'retweet' },
  { id: 'sit-ups', name: 'Sit-ups', icon: 'male' },
];

export default function AssessmentScreen() {
  const router = useRouter();

  const handlePress = (testId: string, testName: string) => {
    // Navigate to the new live assessment screen with parameters
    router.push({
      pathname: '/live-assessment',
      params: { testId, testName },
    });
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Choose a Test</Text>
      <View className="space-y-4">
        {tests.map((test) => (
          <TouchableOpacity
            key={test.id}
            onPress={() => handlePress(test.id, test.name)}
            className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <FontAwesome name={test.icon as any} size={20} color="#4f46e5" />
              <Text className="text-lg font-semibold text-gray-700 ml-4">{test.name}</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}