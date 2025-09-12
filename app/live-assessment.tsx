import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator ,StyleSheet} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// 1. Import CameraView (the component) and other necessary exports
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; 
import { FontAwesome } from '@expo/vector-icons';

// This screen provides the UI for a live AI-powered assessment
export default function LiveAssessmentScreen() {
  const router = useRouter();
  const { testId, testName } = useLocalSearchParams<{ testId: string; testName: string }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Position yourself in the frame and press Start.');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-center text-lg mb-4 text-gray-700">We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-indigo-600 px-5 py-3 rounded-lg">
            <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleStart = () => {
    setIsAnalyzing(true);
    setScore(0);
    // AI Feedback simulation
    setFeedback('Starting assessment... Get ready!');
    setTimeout(() => setFeedback('Begin!'), 2000);
  };

  const handleStopAndSave = () => {
    setIsAnalyzing(false);
    setFeedback('Analysis complete. Saving your score.');

    // In a real app, this is where you'd submit the 'score' to the backend
    Alert.alert(
      'Assessment Complete!',
      `Your score for ${testName} is ${score}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderScoreDisplay = () => {
    // The UI will change based on the test type
    if (testId === 'shuttle-run') {
      // In the real version, a timer would be running here, updating the 'score' state
      return <Text className="text-6xl font-bold text-white tracking-widest">00:00.00</Text>;
    }
    // Default to a rep counter for sit-ups, or a height for vertical jump
    return (
        <View className="items-center">
            <Text className="text-6xl font-bold text-white">{score}</Text>
            <Text className="text-2xl font-semibold text-white">
                {testId === 'sit-ups' ? 'Reps' : 'cm'}
            </Text>
        </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* MODIFIED: Added style={StyleSheet.absoluteFill} to force the camera to cover the screen */}
      <CameraView 
        style={StyleSheet.absoluteFill}
        facing='front'
      >
        {/* The UI Overlay sits on top and is unchanged */}
        <View className="flex-1 bg-black/30 justify-between p-6 pt-16">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">{testName}</Text>
            <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 justify-center items-center">
                <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="items-center">
            {renderScoreDisplay()}
            <Text className="text-lg text-white/90 mt-4 text-center px-4">{feedback}</Text>
          </View>
          <View className="items-center mb-6">
            {!isAnalyzing ? (
              <TouchableOpacity onPress={handleStart} className="bg-green-600 w-24 h-24 rounded-full justify-center items-center border-4 border-white/50">
                <Text className="text-white text-2xl font-bold">Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleStopAndSave} className="bg-red-600 w-24 h-24 rounded-full justify-center items-center border-4 border-white/50">
                <Text className="text-white text-xl font-bold">Stop</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}