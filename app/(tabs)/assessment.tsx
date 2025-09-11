import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Type Definitions ---
type ProgressStatCardProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  value: string;
  label: string;
  color: string;
};

type QuickTestCardProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  name: string;
  duration: string;
  color: string;
  testId: string; // <-- ADDED: A unique ID for the test
};

type ActivityItemProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  name: string;
  time: string;
  score: number;
  color: string;
};

type LeaderboardItem = {
    rank: number;
    name: string;
    score: number;
    avatarUrl: string;
};

// --- Dummy Data (with testId) ---
const progressStats: ProgressStatCardProps[] = [
  { icon: 'trophy', value: '12', label: 'Tests Done', color: '#2ECC71' },
  { icon: 'fire', value: '7', label: 'Day Streak', color: '#F58A2B' },
  { icon: 'line-chart', value: 'A+', label: 'Avg Score', color: '#4A69FF' },
];

// MODIFIED: Added testId to each object
const quickTests: QuickTestCardProps[] = [
    { name: 'Speed Test', duration: '3 min', icon: 'bolt', color: '#4A69FF', testId: 'shuttle-run' },
    { name: 'Strength', duration: '5 min', icon: 'signing', color: '#F58A2B', testId: 'sit-ups' },
];

const recentActivity: ActivityItemProps[] = [
    { name: 'Agility Test', time: '2 hours ago', score: 89, color: '#2ECC71', icon: 'leaf' },
    { name: 'Endurance', time: 'Yesterday', score: 92, color: '#4A69FF', icon: 'heart' },
];

const leaderboard: LeaderboardItem[] = [
    { rank: 1, name: 'Radha', score: 98, avatarUrl: 'https://i.pravatar.cc/150?img=25' },
];
// --- End Dummy Data ---

export default function AssessmentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* --- Header --- */}
        <View className="bg-brand-blue px-6 pb-6 rounded-b-3xl">
          <Header />
          <View className="mt-6">
            <Text className="text-white text-3xl font-bold">You're doing great!</Text>
            <Text className="text-white/80 mt-1">Let's see your progress!</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/assessment')}
            className="bg-brand-orange mt-6 p-4 rounded-xl flex-row justify-center items-center shadow-md space-x-3" activeOpacity={0.8}>
            <FontAwesome name="clock-o" size={20} color="white" />
            <Text className="text-white text-lg font-bold">Start New Assessment</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6">
          {/* --- Today's Progress --- */}
          <SectionHeader title="Today's Progress" rightText="85%" />
          <View className="bg-gray-200 h-2.5 rounded-full overflow-hidden mt-1 mb-4">
            <View className="bg-green-500 h-full w-[85%]" />
          </View>
          <View className="flex-row justify-between space-x-3">
            {progressStats.map(item => <ProgressStatCard key={item.label} {...item} />)}
          </View>

          {/* --- Quick Tests --- */}
          <SectionHeader title="Quick Tests" linkText="View All" onLinkPress={() => router.push('/assessment')} />
          <View className="flex-row justify-between space-x-4">
            {quickTests.map(item => <QuickTestCard key={item.name} {...item} />)}
          </View>
          
          {/* --- Recent Activity --- */}
          <SectionHeader title="Recent Activity" />
          <View className="space-y-3">
            {recentActivity.map(item => <ActivityItem key={item.name} {...item} />)}
          </View>

          {/* --- Leaderboard --- */}
          <SectionHeader title="Leaderboard" linkText="View Full" onLinkPress={() => { /* Navigate to full leaderboard */ }} />
          <LeaderboardCard rank={2} change="+1" leaderboardData={leaderboard} />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Reusable Components ---

const Header = () => {
  const { user } = useUser();
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <View className="bg-white/30 p-2 rounded-full">
          <FontAwesome name="bolt" size={16} color="white" />
        </View>
        <Text className="text-white font-bold text-lg ml-3">Trajektory</Text>
      </View>
      <View className="flex-row items-center space-x-4">
        <FontAwesome name="bell" size={20} color="white" />
        <View className="w-8 h-8 bg-white rounded-full justify-center items-center">
          <Text className="text-brand-blue font-bold">{user?.firstName?.charAt(0)}</Text>
        </View>
      </View>
    </View>
  );
};

const SectionHeader = ({ title, rightText, linkText, onLinkPress }: { title: string; rightText?: string; linkText?: string; onLinkPress?: () => void; }) => (
  <View className="flex-row justify-between items-center mt-8 mb-4">
    <Text className="text-text-primary text-xl font-bold">{title}</Text>
    {rightText && <Text className="text-text-primary font-bold text-lg">{rightText}</Text>}
    {linkText && <TouchableOpacity onPress={onLinkPress}><Text className="text-brand-blue font-semibold">{linkText}</Text></TouchableOpacity>}
  </View>
);

const ProgressStatCard = ({ icon, value, label, color }: ProgressStatCardProps) => (
  <View className="bg-gray-50 border border-gray-200 rounded-xl flex-1 items-center py-4">
    <View style={{ backgroundColor: `${color}20` }} className="w-10 h-10 rounded-full justify-center items-center mb-2">
      <FontAwesome name={icon} size={16} color={color} />
    </View>
    <Text className="text-text-primary text-xl font-bold">{value}</Text>
    <Text className="text-text-secondary text-xs">{label}</Text>
  </View>
);

// MODIFIED: This component now handles navigation
const QuickTestCard = ({ icon, name, duration, color, testId }: QuickTestCardProps) => {
  const router = useRouter();

  const handleStartPress = () => {
    router.push({
      pathname: '/live-assessment',
      params: { testId, testName: name },
    });
  };

  return (
    <View className="bg-gray-50 border border-gray-200 rounded-xl flex-1 p-4">
      <View style={{ backgroundColor: `${color}20` }} className="w-10 h-10 rounded-lg justify-center items-center mb-3">
        <FontAwesome name={icon} size={18} color={color} />
      </View>
      <Text className="text-text-primary font-bold text-base">{name}</Text>
      <View className="flex-row items-center my-1">
          {[...Array(5)].map((_, i) => <FontAwesome key={i} name="star" size={12} color={i < 4 ? '#FBBF24' : '#E5E7EB'} />)}
          <Text className="text-text-secondary text-xs ml-2">{duration}</Text>
      </View>
      <TouchableOpacity 
        style={{ backgroundColor: color }} 
        className="mt-2 py-2 rounded-lg" 
        activeOpacity={0.8}
        onPress={handleStartPress} // <-- ADDED: Navigation logic
      >
        <Text className="text-white text-center font-bold">Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const ActivityItem = ({ icon, name, time, score, color }: ActivityItemProps) => (
  <View className="bg-white border border-gray-200 rounded-xl p-3 flex-row items-center justify-between">
    <View className="flex-row items-center">
      <View style={{ backgroundColor: `${color}20` }} className="w-10 h-10 rounded-lg justify-center items-center mr-3">
        <FontAwesome name={icon} size={18} color={color} />
      </View>
      <View>
        <Text className="text-text-primary font-bold">{name}</Text>
        <Text className="text-text-secondary text-xs">{time}</Text>
      </View>
    </View>
    <View className="bg-text-primary px-3 py-1.5 rounded-md">
        <Text className="text-white font-bold text-base">{score}</Text>
    </View>
  </View>
);

const LeaderboardCard = ({ rank, change, leaderboardData }: { rank: number; change: string; leaderboardData: LeaderboardItem[] }) => (
    <View className="bg-white border border-gray-200 rounded-xl p-4">
        <Text className="text-text-secondary text-sm text-center">Your Current Rank</Text>
        <View className="flex-row justify-center items-center space-x-2 my-1">
            <Text className="text-brand-orange text-4xl font-extrabold">#{rank}</Text>
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-green-600 font-bold text-xs">{change}</Text>
            </View>
        </View>
        <Text className="text-text-secondary text-sm text-center">Push harder to move up 1 rank 🚀</Text>
        <View className="h-[1px] bg-gray-200 my-4" />
        {leaderboardData.map(user => (
            <View key={user.rank} className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Text className="text-text-secondary font-bold w-6">{user.rank}</Text>
                    <Image source={{ uri: user.avatarUrl }} className="w-9 h-9 rounded-full mr-3" />
                    <Text className="text-text-primary font-bold">{user.name}</Text>
                </View>
                <Text className="text-text-primary font-bold text-lg">{user.score}</Text>
            </View>
        ))}
    </View>
);