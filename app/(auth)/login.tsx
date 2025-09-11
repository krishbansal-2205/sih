// @/app/(auth)/login.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, Image, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const GoogleLogo = require('../../assets/images/google-logo.png'); 

export default function LoginScreen() {
  const { startSSOFlow } = useSSO();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Animation values
  const animation = useSharedValue(0);

  useEffect(() => {
    // Start the animation when the component mounts
    animation.value = withTiming(1, { duration: 1200 });
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const onPressGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri();
      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (result?.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes('already signed in')) {
        router.replace('/');
        return;
      }
      console.error('Google SSO failed', err);
      Alert.alert('Sign-in error', msg);
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [{ translateY: interpolate(animation.value, [0, 1], [-50, 0]) }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [{ translateY: interpolate(animation.value, [0, 1], [50, 0]) }],
    };
  });

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#4A69FF', '#2A49B6']}
        style={StyleSheet.absoluteFill}
      >
        <View className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />
        <View className="absolute bottom-10 -right-20 w-40 h-40 bg-white/10 rounded-full" />
      </LinearGradient>

      <SafeAreaView className="flex-1 justify-between p-8">
        <Animated.View style={headerAnimatedStyle} className="items-center mt-16">
            <View className="bg-white/20 p-4 rounded-full shadow-lg">
                <FontAwesome name="bolt" size={32} color="white" />
            </View>
            <Text className="text-white text-4xl font-extrabold mt-4">Trajektory</Text>
            <Text className="text-white/80 text-lg">Your talent. Your progress.</Text>
        </Animated.View>

        <Animated.View style={buttonAnimatedStyle} className="w-full">
            <TouchableOpacity
                onPress={onPressGoogle}
                disabled={loading}
                className="flex-row items-center justify-center bg-white rounded-2xl p-4 w-full shadow-lg"
                activeOpacity={0.8}
            >
                {loading ? (
                <ActivityIndicator color="#1E293B" />
                ) : (
                <>
                    <Image source={GoogleLogo} className="w-6 h-6 mr-4" />
                    <Text className="text-text-primary text-base font-bold">
                        Continue with Google
                    </Text>
                </>
                )}
            </TouchableOpacity>
            <Text className="text-white/60 text-xs text-center mt-4">
              Sign in or sign up in seconds.
            </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}