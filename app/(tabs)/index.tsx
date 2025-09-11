import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Type Definitions for Component Props ---
type SectionHeaderProps = {
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
};

type StatRowProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  change: string;
  iconColor: string;
};

type AssessmentCardProps = {
  name: string;
  duration: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
};

type ActivityItemProps = {
  name: string;
  time: string;
  score: number;
  comment: string;
  color: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

// --- Dummy Data ---
const assessments: AssessmentCardProps[] = [
  { name: 'Speed Test', duration: '5 min', icon: 'bolt', color: '#4A69FF' },
  { name: 'Strength', duration: '8 min', icon: 'signing', color: '#F58A2B' },
  { name: 'Endurance', duration: '12 min', icon: 'heart', color: '#2ECC71' },
  { name: 'Precision', duration: '6 min', icon: 'bullseye', color: '#9B59B6' },
];

const recentActivity: ActivityItemProps[] = [
  { name: 'Speed Test', time: 'Yesterday • 5 min', score: 89, comment: 'Great form!', color: '#4A69FF', icon: 'bolt' },
  { name: 'Strength Test', time: '2 days ago • 8 min', score: 92, comment: 'Personal best!', color: '#F58A2B', icon: 'signing' },
];
// --- End of Dummy Data ---

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-brand-background">
      {/* --- Simplified Header --- */}
      <View className="bg-brand-blue px-6 pt-4 pb-6">
        <Header />
        <View className="mt-4">
          <Text className="text-white text-3xl font-bold">Welcome back, {user?.firstName}</Text>
          <Text className="text-white/80 mt-1">Ready to test your limits?</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-6">
          {/* --- Focused CTA Button --- */}
          <TouchableOpacity 
            onPress={() => router.push('/assessment')}
            className="bg-brand-orange mt-6 p-4 rounded-xl flex-row justify-between items-center shadow-md" activeOpacity={0.8}>
            <View>
              <Text className="text-white text-lg font-bold">Start New Assessment</Text>
              <Text className="text-white/90">Measure your performance</Text>
            </View>
            <View className="bg-white/30 w-10 h-10 rounded-full justify-center items-center">
              <FontAwesome name="clock-o" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* --- Consolidated Stats --- */}
          <SectionHeader title="Weekly Overview" />
          <View className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
            <StatRow icon="trophy" label="Best Score" value="92" change="+10% this week" iconColor="#F59E0B" />
            <View className="h-[1px] bg-gray-100" />
            <StatRow icon="fire" label="Streak" value="7" change="days in a row!" iconColor="#EF4444" />
          </View>

          {/* --- Horizontal Assessment Picker --- */}
          <SectionHeader title="Choose Assessment" onPress={() => router.push('/assessment')} showArrow />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            <View className="flex-row space-x-4">
              {assessments.map(item => <AssessmentCard key={item.name} {...item} />)}
            </View>
          </ScrollView>

          {/* --- Recent Activity --- */}
          <SectionHeader title="Recent Activity" onPress={() => { /* Navigate to full activity list */ }} showArrow />
          <View className="space-y-3">
            {recentActivity.map(item => <ActivityItem key={item.name} {...item} />)}
          </View>
          
          {/* --- Today's Tip --- */}
          <TodaysTip />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Reusable Components (Refined for the new layout) ---

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

const SectionHeader = ({ title, onPress, showArrow = false }: SectionHeaderProps) => (
  <View className="flex-row justify-between items-center mt-10 mb-4">
    <Text className="text-text-primary text-xl font-bold">{title}</Text>
    {showArrow && (
      <TouchableOpacity onPress={onPress}>
        <Text className="text-brand-blue font-semibold">View All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const StatRow = ({ icon, label, value, change, iconColor }: StatRowProps) => (
  <View className="flex-row items-center">
    <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
      <FontAwesome name={icon} size={18} color={iconColor} />
    </View>
    <View className="flex-1 ml-4">
      <Text className="text-text-secondary text-sm">{label}</Text>
      <View className="flex-row items-baseline space-x-2">
        <Text className="text-text-primary text-2xl font-bold">{value}</Text>
        <Text className="text-green-500 font-semibold text-xs">{change}</Text>
      </View>
    </View>
  </View>
);

const AssessmentCard = ({ name, duration, icon, color }: AssessmentCardProps) => (
  <View className="bg-white p-4 rounded-xl shadow-sm w-40">
    <View style={{ backgroundColor: `${color}20` }} className="w-10 h-10 rounded-lg justify-center items-center mb-3">
      <FontAwesome name={icon} size={18} color={color} />
    </View>
    <Text className="text-text-primary font-bold text-base">{name}</Text>
    <Text className="text-text-secondary text-xs mt-1">{duration}</Text>
    <View className="flex-row items-center mt-4">
      <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
      <Text className="text-green-600 text-xs font-semibold">Available</Text>
    </View>
  </View>
);

const ActivityItem = ({ name, time, score, comment, color, icon }: ActivityItemProps) => (
  <View className="bg-white p-4 rounded-xl flex-row items-center justify-between shadow-sm">
    <View className="flex-row items-center">
      <View style={{ backgroundColor: `${color}20` }} className="w-10 h-10 rounded-full justify-center items-center mr-3">
        <FontAwesome name={icon} size={16} color={color} />
      </View>
      <View>
        <Text className="text-text-primary font-bold">{name}</Text>
        <Text className="text-text-secondary text-xs">{time}</Text>
      </View>
    </View>
    <View className="items-end">
      <Text className="text-text-primary text-xl font-extrabold">{score}</Text>
      <Text className="text-xs font-semibold" style={{ color: comment === 'Personal best!' ? '#F59E0B' : '#2ECC71' }}>{comment}</Text>
    </View>
  </View>
);

const TodaysTip = () => (
    <View className="bg-green-50 border border-green-200 p-4 rounded-xl mt-10">
      <View className="flex-row items-center mb-2">
        <FontAwesome name="lightbulb-o" size={16} color="#166534" />
        <Text className="text-green-800 font-bold ml-2">Today's Tip</Text>
      </View>
      <Text className="text-green-700 text-sm leading-5">Warm up for 2-3 minutes before starting any speed or strength tests to prevent injury.</Text>
    </View>
);