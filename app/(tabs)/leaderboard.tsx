// @/app/(tabs)/leaderboard.tsx
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react'; // MODIFIED: Removed useState
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// --- Type Definitions ---
// MODIFIED: TimeFilterOption is no longer needed
type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
};

// --- Dummy Data ---
// MODIFIED: Only one set of data is needed now
const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: 'Radha', points: 2143, avatar: 'https://i.pravatar.cc/150?img=25' },
  { rank: 2, name: 'You', points: 1856, avatar: '', isCurrentUser: true },
  { rank: 3, name: 'Raman', points: 1789, avatar: 'https://i.pravatar.cc/150?img=68' },
  { rank: 4, name: 'James', points: 1089, avatar: 'https://i.pravatar.cc/150?img=32' },
  { rank: 5, name: 'Maria', points: 987, avatar: 'https://i.pravatar.cc/150?img=31' },
  { rank: 6, name: 'Li Wei', points: 850, avatar: 'https://i.pravatar.cc/150?img=11' },
];

const currentUser = leaderboardData.find(u => u.isCurrentUser);
// --- End Dummy Data ---

export default function LeaderboardScreen() {
  // MODIFIED: All state and effects have been removed.

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-brand-background">
       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* --- Header --- */}
        <LinearGradient colors={['#4A69FF', '#2A49B6']} className="px-6 pb-6 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-4">
              <View>
                  <Text className="text-white text-3xl font-bold">Leaderboard</Text>
                  <Text className="text-white/80">Track your progress</Text>
              </View>
              <View className="bg-white/20 w-12 h-12 rounded-full justify-center items-center">
                  <FontAwesome name="trophy" size={24} color="#F58A2B" />
              </View>
          </View>
        </LinearGradient>

        {/* --- Content --- */}
        <View className="px-6 pt-6">
            {/* --- Time Filter REMOVED --- */}

            {/* --- Your Rank Card --- */}
            {currentUser && <UserRankCard rank={currentUser.rank} points={currentUser.points} />}

            {/* --- Top 3 Podium --- */}
            <Podium topThree={leaderboardData.slice(0, 3)} />

            {/* --- Leaderboard List --- */}
            <View className="mt-6 space-y-3">
                {leaderboardData.map(user => (
                    <LeaderboardListItem key={user.rank} {...user} />
                ))}
            </View>

            {/* --- Motivational Card --- */}
            <MotivationalCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// --- Reusable Components (TimeFilter component is now gone) ---

const UserRankCard = ({ rank, points }: { rank: number, points: number }) => (
    <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mt-6 flex-row justify-between items-center">
        <View>
            <Text className="text-rose-400 text-xs font-bold"># {rank}</Text>
            <Text className="text-text-primary font-bold text-lg">Your Rank</Text>
            <Text className="text-text-secondary text-sm">{points.toLocaleString()} points</Text>
        </View>
        <View className="items-center">
            <Text className="text-text-secondary text-xs">Push harder to move up</Text>
            <Text className="text-red-500 font-bold text-base">1 rank 🚀</Text>
        </View>
    </View>
);

const Podium = ({ topThree }: { topThree: LeaderboardUser[] }) => {
    const { user } = useUser();
    const first = topThree[0];
    const second = topThree[1];
    const third = topThree[2];

    if (!first || !second || !third) return null;

    if (second.isCurrentUser) second.avatar = user?.imageUrl ?? '';
    
    return (
        <View className="flex-row justify-center items-end mt-8 space-x-4">
            <View className="items-center">
                <Image source={{ uri: second.avatar }} className="w-16 h-16 rounded-full border-4 border-gray-300 mb-2"/>
                <View className="bg-white p-3 rounded-lg w-24 items-center shadow">
                    <Text className="text-text-primary font-bold">{second.name}</Text>
                    <Text className="text-text-secondary text-sm">{second.points.toLocaleString()}</Text>
                </View>
            </View>
            <View className="items-center">
                <View className="relative">
                    <Image source={{ uri: first.avatar }} className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-2"/>
                    <FontAwesome name="trophy" size={24} color="gold" style={{ position: 'absolute', top: -15, right: -5 }}/>
                </View>
                <LinearGradient colors={['#FFD700', '#FFA500']} className="p-3 rounded-lg w-28 items-center shadow-lg">
                    <Text className="text-white font-bold">{first.name}</Text>
                    <Text className="text-white/80 text-sm">{first.points.toLocaleString()}</Text>
                </LinearGradient>
            </View>
            <View className="items-center">
                 <Image source={{ uri: third.avatar }} className="w-16 h-16 rounded-full border-4 border-orange-300 mb-2"/>
                 <View className="bg-white p-3 rounded-lg w-24 items-center shadow">
                    <Text className="text-text-primary font-bold">{third.name}</Text>
                    <Text className="text-text-secondary text-sm">{third.points.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
};

const LeaderboardListItem = ({ rank, name, points, avatar, isCurrentUser }: LeaderboardUser) => {
    const { user } = useUser();
    const userAvatar = isCurrentUser ? user?.imageUrl : avatar;
    const highlightClass = isCurrentUser ? 'bg-blue-50 border-brand-blue' : 'bg-white border-gray-200';
    const rankColor = isCurrentUser ? 'bg-brand-blue' : 'bg-gray-200';
    const rankTextColor = isCurrentUser ? 'text-white' : 'text-text-secondary';
    const icon = isCurrentUser ? 'rocket' : 'shield';

    return (
        <View className={`p-3 rounded-xl flex-row items-center justify-between border ${highlightClass}`}>
            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-full justify-center items-center mr-3 ${rankColor}`}>
                    <Text className={`font-bold ${rankTextColor}`}>{rank}</Text>
                </View>
                <Image source={{ uri: userAvatar }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                    <Text className="text-text-primary font-bold">{name}</Text>
                    <Text className="text-text-secondary text-sm">{points.toLocaleString()} points</Text>
                </View>
            </View>
            <FontAwesome name={icon} size={16} color={isCurrentUser ? '#F58A2B' : '#4A69FF'} />
        </View>
    );
};

const MotivationalCard = () => (
    <View className="mt-8 rounded-2xl overflow-hidden">
        <LinearGradient colors={['#2ECC71', '#4A69FF']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} className="p-6 items-center">
            <View className="bg-white/30 w-12 h-12 rounded-full justify-center items-center mb-3">
                <FontAwesome name="heart" size={24} color="#F58A2B" />
            </View>
            <Text className="text-white text-2xl font-bold">Keep Pushing!</Text>
            <Text className="text-white/80 text-center mt-1">Complete 2 more workouts to climb the leaderboard</Text>
        </LinearGradient>
    </View>
);