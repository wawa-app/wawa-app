import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Button from '../components/common/Button';

export default function PasswordResetSuccessScreen({ navigation }) {
    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content frame — excludes button */}
            <View className="px-8 items-center">

                {/* Checkmark icon */}
                <Svg width={97} height={97} viewBox="0 0 97 97" fill="none">
                    <Path
                        d="M48.5 3.03125C23.3876 3.03125 3.03125 23.3891 3.03125 48.5C3.03125 73.6109 23.3891 93.9688 48.5 93.9688C73.6109 93.9688 93.9688 73.6109 93.9688 48.5C93.9688 23.3891 73.6109 3.03125 48.5 3.03125ZM37.9285 75.7812L37.8982 75.7509L37.8724 75.7812L16.6719 53.9562L27.3252 43.0983L37.8997 53.9866L69.7278 21.2203L80.3281 32.1297L37.9285 75.7812Z"
                        fill="black"
                    />
                </Svg>

                {/* gap: 30px */}
                <View className="h-[30px]" />

                {/* Message */}
                <Text className="text-[18px] font-semibold text-black text-center leading-[21.6px] tracking-[-0.36px] self-stretch">
                    Your Password was Reset Successfully
                </Text>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button pinned to bottom */}
            <View className="px-8 pb-[101px]">
                <Button
                    title="Back to Sign In"
                    onPress={() => navigation.navigate('SignIn')}
                    fullWidth
                />
            </View>

        </View>
    );
}
