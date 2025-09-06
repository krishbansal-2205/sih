// app/(auth)/login.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { startSSOFlow } = useSSO();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If already signed in, send to app
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // warm up web browser only on native
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
      // On web useProxy:true so Expo's dev OAuth proxy works. On native useProxy:false.
      const redirectUrl = AuthSession.makeRedirectUri();

      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (result?.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
        // navigate to the app
        router.replace('/');
      } else {
        // additional steps (e.g., required data collection) may be required; Clerk will return objects
        console.log('SSO flow returned (inspect result):', result);
      }
    } catch (err: any) {
      // handle the common "already signed in" message gracefully
      const msg = err?.message ?? String(err);
      if (msg.includes("already signed in")) {
        router.replace('/');
        return;
      }
      console.error('Google SSO failed', err);
      Alert.alert('Sign-in error', msg);
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-50 to-white items-center justify-center px-6">
      <Text className="text-2xl font-extrabold text-gray-900 mb-2">Welcome to SAI Talent</Text>
      <Text className="text-base text-gray-600 text-center mb-10">
        Showcase your athletic skills through AI-powered assessments
      </Text>

      <TouchableOpacity
        onPress={onPressGoogle}
        disabled={loading}
        className="flex-row items-center bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-200 w-full max-w-xs"
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-base font-semibold text-gray-800">Continue with Google</Text>
        )}
      </TouchableOpacity>

      <Text className="mt-6 text-xs text-gray-500 text-center">
        Sign in or sign up quickly using your Google account
      </Text>
    </View>
  );
}
