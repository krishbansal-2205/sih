import { onboarding } from '@/constants';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const Welcome = () => {
   const swiperRef = useRef<Swiper>(null);
   const [activeIndex, setActiveIndex] = useState(0);
   const isLastSlide = activeIndex === onboarding.length - 1;

   return (
      <SafeAreaView className='flex h-full items-center justify-between'>
         <TouchableOpacity
            onPress={() => {
               router.replace('/(auth)/login');
            }}
            className='w-full flex justify-end items-end p-5'
         >
            <Text className='text-black text-base font-JakartaBold'>Skip</Text>
         </TouchableOpacity>
         <Swiper
            ref={swiperRef}
            loop={false}
            dot={
               <View className='w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full' />
            }
            activeDot={
               <View className='w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full' />
            }
            onIndexChanged={(index) => setActiveIndex(index)}
         >
            {onboarding.map((item) => (
               <View
                  key={item.id}
                  className='flex items-center justify-center p-5'
               >
                  <Image
                     source={item.image}
                     className='w-full h-[300px]'
                     resizeMode='contain'
                  />
                  <View className='flex flex-row items-center justify-center w-full mt-10'>
                     <Text className='text-black text-3xl font-bold mt-10 text-center'>
                        {item.title}
                     </Text>
                  </View>
                  <Text className='text-lg font-JakartaSemiBold text-center mx-10 mt-3 text-[#858585]'>
                     {item.description}
                  </Text>
               </View>
            ))}
         </Swiper>
         <TouchableOpacity
            onPress={() => {
               isLastSlide
                  ? router.replace('/(auth)/login')
                  : swiperRef.current?.scrollBy(1);
            }}
            className='w-4/5 rounded-full p-3 mb-2 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 bg-[#0286FF] mt-10'
         >
            <Text className='text-lg font-bold text-white'>
               {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default Welcome;
