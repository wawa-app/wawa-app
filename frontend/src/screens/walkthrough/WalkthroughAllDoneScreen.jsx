import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const BadgeIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        {/* Outer seal shape */}
        <Path
            d="M40 4l5.88 8.09 9.53-3.9 1.62 10.18 10.18 1.62-3.9 9.53L71.3 35.1 63.21 40l8.09 4.9-8.09 5.88 3.9 9.53-10.18 1.62-1.62 10.18-9.53-3.9L40 76l-5.88-8.09-9.53 3.9-1.62-10.18-10.18-1.62 3.9-9.53L8.7 44.9 16.79 40 8.7 35.1l8.09-5.88-3.9-9.53 10.18-1.62 1.62-10.18 9.53 3.9L40 4z"
            fill="#1A0F07"
        />
        {/* Checkmark */}
        <Path
            d="M26 40l10 10 18-18"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default function WalkthroughAllDoneScreen({ navigation }) {
    const { user } = useAuth();

    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Stepper — all steps completed */}
            <Stepper currentStep={4} steps={WALKTHROUGH_STEPS} />

            {/* gap: 37px */}
            <View className="h-[37px]" />

            {/* Badge icon */}
            <View className="items-center">
                <BadgeIcon />
            </View>

            {/* gap: 95px → reduced since text follows */}
            <View className="h-[37px]" />

            {/* Text content */}
            <View className="px-8 items-center" style={{ gap: 8 }}>
                <Text className="text-[20px] font-bold text-black text-center">
                    You're all set!
                </Text>
                <Text className="text-[14px] font-normal text-black text-center leading-[16.8px]">
                    WaWa now is ready for a new challenge
                </Text>
            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button */}
            <View className="w-[296px] self-center pb-[101px]">
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Main')}
                    fullWidth
                />
            </View>

        </View>
    );
}
