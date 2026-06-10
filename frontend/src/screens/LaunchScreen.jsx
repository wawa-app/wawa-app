import React from 'react';
import { View, Text, Image } from 'react-native';
import Button from '../components/common/Button';

export default function LaunchScreen({ navigation }) {
    return (
        <View className="flex-1 bg-white items-center">

            {/* Status bar */}
            <View className="h-6 self-stretch" />

            {/* Header zone */}
            <View className="h-16 self-stretch" />

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content frame: w-328px h-454px, gap-40px */}
            <View className="w-[328px] h-[454px] flex-col justify-center items-center">

                {/* Logo + WaWa name */}
                <View className="items-center mb-[40px]">

                    {/* Logo placeholder — replace with actual image later */}
                    <View className="w-14 h-14 border-2 border-black items-center justify-center mb-[32px]">
                        <Text className="text-3xl text-[#1a1a1a]">✕</Text>
                    </View>

                    {/* App name */}
                    <Text className="text-[48px] font-medium text-black text-center leading-[48px] self-stretch">
                        WaWa
                    </Text>

                </View>

                {/* Description */}
                <Text className="text-[14px] font-light text-black text-center leading-[14px]">
                    WaWa is a challenge-based alarm app that helps users build a reliable morning routine through visual search missions, smart image recognition, habit tracking, and rewards.
                </Text>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button pinned to bottom */}
            <View className="w-[296px] pb-[101px]">
                <Button
                    title="Get Started"
                    onPress={() => navigation.navigate('SignUp')}
                    fullWidth
                />
            </View>

        </View>
    );
}
