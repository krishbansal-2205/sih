import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function InitialLayout() {
   const { isLoaded, isSignedIn } = useAuth();
   const segments = useSegments();
   const router = useRouter();

   useEffect(() => {
      // Wait for Clerk to be ready before acting
      if (!isLoaded) {
         return;
      }
      const inAuthGroup = segments[0] === '(auth)';

      if (isSignedIn && inAuthGroup) {
         router.replace('/');
      } else if (!isSignedIn && !inAuthGroup) {
         router.replace('/(auth)/onboarding');
      }
   }, [isLoaded, isSignedIn, segments, router]);
   if (!isLoaded) {
      return null; // Or a loading spinner
   }

   return <Slot />;
}

export default function RootLayout() {
   if (!CLERK_PUBLISHABLE_KEY) {
      console.warn(
         'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Set it in your environment.'
      );
   }

   return (
      <ClerkProvider
         tokenCache={tokenCache}
         publishableKey={CLERK_PUBLISHABLE_KEY!}
      >  
         <StatusBar hidden />
         <InitialLayout />
      </ClerkProvider>
   );
}