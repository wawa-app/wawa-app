import React from 'react';
import { View, Text, Image } from 'react-native';
import Button from '../../components/common/Button';

const uniCharacter = require('../../assets/images/Uni.png');
const waLogo = require('../../assets/images/WA.png');

export default function LaunchScreen({ navigation }) {
    return (
        <View className="flex-1 bg-Base-Background items-center">

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content */}
            <View className="items-center px-8">

                {/* Uni character */}
                <Image
                    source={uniCharacter}
                    style={{ width: 180, height: 180 }}
                    resizeMode="contain"
                />

                {/* WA logo */}
                <Image
                    source={waLogo}
                    style={{ width: 120, height: 47 }}
                    resizeMode="contain"
                    className="mt-6"
                />

                {/* Title */}
                <Text className="text-[22px] font-bold text-Base-OnBackground text-center mt-3">
                    WAys to WAke up
                </Text>

                {/* Description */}
                <Text className="text-[14px] font-geologica-regular text-Base-OnBackground text-center mt-4 leading-[22px]">
                    WaWa is a challenge-based alarm app that helps users build a reliable morning routine through visual search missions, smart image recognition, habit tracking, and rewards.
                </Text>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Get Started button */}
            <View style={{ paddingHorizontal: 34, paddingBottom: 104, width: '100%' }}>
                <Button
                    title="Get Started"
                    onPress={() => navigation.navigate('SignUp')}
                    fullWidth
                    shape="round"
                />
            </View>

        </View>
    );
}
