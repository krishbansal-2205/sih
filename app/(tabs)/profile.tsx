import { useAuth, useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy Data - Replace with API calls
const personalBests = [
  { icon: 'bolt', name: '100m Sprint', time: 'Last Week', value: '10.85s', improvement: '+0.2s improvement', color: '#FFC107' },
  { icon: 'arrows-v', name: 'Long Jump', time: '3 days ago', value: '7.2m', improvement: 'New record!', color: '#4A69FF' },
];

const recentAssessments = [
  { icon: 'tachometer', title: 'Speed Assessment', time: 'Today, 2:30 PM', note: 'Great form! Keep pushing!', color: '#4A69FF', statusColor: 'bg-green-500' },
  { icon: 'signing', title: 'Strength Test', time: 'Yesterday, 4:15 PM', note: 'Almost there! Excellent progress.', color: '#F58A2B', statusColor: 'bg-blue-500' }, // Changed icon to one that exists
  { icon: 'heartbeat', title: 'Endurance Check', time: '2 days ago, 6:00 AM', note: 'Solid performance! Keep it up.', color: '#2ECC71', statusColor: 'bg-yellow-500' },
];

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-brand-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Header --- */}
        <View className="relative mb-32">
          <LinearGradient
            colors={['#4A69FF', '#F58A2B']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            className="h-48 rounded-b-3xl overflow-hidden"
          >
            {/* NEW: Decorative circles for a more accurate UI */}
            <View className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
            <View className="absolute top-10 -left-20 w-40 h-40 bg-white/10 rounded-full" />
          </LinearGradient>
          
          <View className="absolute top-0 left-0 right-0 p-5 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-white/30 p-2 rounded-full">
                <FontAwesome name="bolt" size={16} color="white" />
              </View>
              <View className="ml-3">
                <Text className="text-white font-bold text-lg">Trajektory</Text>
                <Text className="text-white/80 text-xs">Your talent. Your progress.</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-4">
              <FontAwesome name="bell" size={20} color="white" />
              <View className="w-8 h-8 bg-white rounded-full justify-center items-center">
                <Text className="text-brand-blue font-bold">{user?.firstName?.charAt(0)}</Text>
              </View>
            </View>
          </View>

          {/* --- Profile Info --- */}
          <View className="items-center absolute top-24 left-0 right-0">
            <View className="relative">
              <Image source={{ uri: user?.imageUrl }} className="w-24 h-24 rounded-full border-4 border-white" />
              <View className="absolute -bottom-1 -right-1 bg-success p-1 rounded-full border-2 border-white">
                <FontAwesome name="trophy" size={14} color="white" />
              </View>
            </View>
            <Text className="text-2xl font-bold text-text-primary mt-3">{user?.fullName ?? "Rajendra"}</Text>
            <Text className="text-text-secondary">Track & Field Athlete</Text>
            <View className="bg-white/80 px-4 py-1 rounded-full mt-2 shadow-sm">
                <Text className="text-text-secondary text-xs italic">"Champions are built, not born"</Text>
            </View>
          </View>
        </View>

        {/* --- Stats, Bests, and Assessments (Content) --- */}
        <View className="px-5">
            <View className="flex-row justify-around">
                <StatCard icon="fire" value="7" label="Day Streak" color="#FF6347" />
                <StatCard icon="trophy" value="8" label="Achievements" color="#FFC107" />
                <StatCard icon="line-chart" value="94%" label="Progress" color="#2ECC71" />
            </View>

            <Section title="Personal Bests">
              {personalBests.map((item, index) => <BestCard key={index} {...item} />)}
            </Section>

            <Section title="Recent Assessments">
              {recentAssessments.map((item, index) => <TimelineItem key={index} isLast={index === recentAssessments.length - 1} {...item} />)}
            </Section>

            <TouchableOpacity onPress={() => signOut()} className="my-10 bg-red-100 py-3 rounded-xl">
                <Text className="text-center font-bold text-red-600">Sign Out</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Reusable Components (No changes needed here) ---
const StatCard = ({ icon, value, label, color }: { icon: any, value: string, label: string, color: string }) => (
  <View className="bg-white p-4 rounded-2xl shadow-sm items-center w-28">
    <View style={{ backgroundColor: `${color}30` }} className="w-10 h-10 rounded-full justify-center items-center mb-2">
        <FontAwesome name={icon} size={18} color={color} />
    </View>
    <Text className="text-xl font-bold text-text-primary">{value}</Text>
    <Text className="text-xs text-text-secondary">{label}</Text>
  </View>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View className="mt-8">
        <Text className="text-lg font-bold text-text-primary mb-4">{title}</Text>
        <View className="space-y-3">{children}</View>
    </View>
);

const BestCard = ({ icon, name, time, value, improvement, color }: { icon: any, name: string, time: string, value: string, improvement: string, color: string }) => (
    <View className="bg-white p-4 rounded-xl flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
            <View style={{backgroundColor: color}} className="w-12 h-12 rounded-lg justify-center items-center mr-4">
                <FontAwesome name={icon} size={20} color="white" />
            </View>
            <View>
                <Text className="font-bold text-text-primary">{name}</Text>
                <Text className="text-xs text-text-secondary">{time}</Text>
            </View>
        </View>
        <View className="items-end">
            <Text className="font-extrabold text-xl text-text-primary">{value}</Text>
            <Text className="text-xs text-success font-semibold">{improvement}</Text>
        </View>
    </View>
);

const TimelineItem = ({ icon, title, time, note, color, statusColor, isLast }: { icon: any, title: string, time: string, note: string, color: string, statusColor: string, isLast: boolean }) => (
    <View className="flex-row">
        <View className="items-center mr-2">
            <View style={{ backgroundColor: color }} className="w-10 h-10 rounded-full justify-center items-center z-10 border-2 border-brand-background">
                <FontAwesome name={icon} size={16} color="white" />
            </View>
            {!isLast && <View className="w-0.5 flex-1 bg-gray-200" />}
        </View>
        <View className={`bg-white p-4 rounded-xl flex-1 mb-3 shadow-sm`}>
            <Text className="font-bold text-text-primary">{title}</Text>
            <Text className="text-xs text-text-secondary my-1">{time}</Text>
            <View className="flex-row items-center mt-1">
                <View className={`w-2 h-2 rounded-full mr-2 ${statusColor}`} />
                <Text className="text-sm text-text-secondary">{note}</Text>
            </View>
        </View>
    </View>
);