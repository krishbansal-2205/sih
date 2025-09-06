import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'

// Auth screen for React Native + NativeWind + Clerk
// Works on mobile (iOS/Android) and avoids errors on web.

export default function AuthScreen() {
  const { startSSOFlow } = useSSO()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // warmUpAsync / coolDownAsync only exist on mobile
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }
  }, [])

  const onPressGoogle = useCallback(async () => {
    setLoading(true)
    try {
      const redirectUrl = AuthSession.makeRedirectUri()

      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })

      if (result?.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId })
        // Navigate to your app's home/protected screen here
      } else {
        console.log('Additional steps may be required', result)
      }
    } catch (err: any) {
      console.error('Google SSO failed', err)
      Alert.alert('Sign-in error', err?.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [startSSOFlow])

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
  )
}
