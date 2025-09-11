import { onboarding } from '@/constants';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

export default function OnboardingScreen() {
   const swiperRef = useRef<Swiper>(null);
   const router = useRouter();
   const [activeIndex, setActiveIndex] = useState(0);
   const isLastSlide = activeIndex === onboarding.length - 1;

   const handleNext = () => {
      if (isLastSlide) {
         router.replace('/(auth)/login');
      } else {
         swiperRef.current?.scrollBy(1);
      }
   };

   const handlePrev = () => {
      swiperRef.current?.scrollBy(-1);
   };

   return (
      <SafeAreaView className="flex-1 bg-[#2A49B6]">
         {/* Top Section with Image Swiper and Arrows */}
         <View className="relative flex-1 justify-center items-center">
            <Swiper
               ref={swiperRef}
               loop={false}
               showsPagination={false}
               onIndexChanged={(index) => setActiveIndex(index)}
            >
               {onboarding.map((item) => (
                  <View
                     key={item.id}
                     className="flex-1 justify-center items-center"
                  >
                     <Image
                        source={item.image}
                        className="w-[85%] h-[90%] rounded-2xl"
                        resizeMode="cover"
                     />
                  </View>
               ))}
            </Swiper>

            {/* Previous Arrow */}
            {activeIndex > 0 && (
               <TouchableOpacity
                  onPress={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-5 w-10 h-10 bg-white/80 rounded-full justify-center items-center"
                  activeOpacity={0.7}
               >
                  <FontAwesome
                     name="chevron-left"
                     size={16}
                     color="#2A49B6"
                  />
               </TouchableOpacity>
            )}

            {/* Next Arrow */}
            {!isLastSlide && (
               <TouchableOpacity
                  onPress={() => swiperRef.current?.scrollBy(1)}
                  className="absolute right-4 top-1/2 -translate-y-5 w-10 h-10 bg-white/80 rounded-full justify-center items-center"
                  activeOpacity={0.7}
               >
                  <FontAwesome
                     name="chevron-right"
                     size={16}
                     color="#2A49B6"
                  />
               </TouchableOpacity>
            )}
         </View>

         {/* Bottom Section with Text and Button */}
         <View className="px-8 pb-10 pt-6">
            <Text className="text-4xl text-white font-bold text-center leading-tight">
               {onboarding[activeIndex].title}
            </Text>

            <Text className="text-white/80 text-base text-center mt-4 mb-10">
               {onboarding[activeIndex].description}
            </Text>

            <TouchableOpacity
               onPress={handleNext}
               className="w-full bg-[#F58A2B] rounded-2xl py-4 shadow-lg"
               activeOpacity={0.8}
            >
               <Text className="text-lg font-bold text-white text-center">
                  {isLastSlide ? 'Get Started' : 'Next'}
               </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6 space-x-2">
               <FontAwesome name="shield" size={14} color="white" />
               <Text className="text-white/80 text-sm font-medium">
                  Secure • Fair • Progressive
               </Text>
            </View>
         </View>
      </SafeAreaView>
   );
}