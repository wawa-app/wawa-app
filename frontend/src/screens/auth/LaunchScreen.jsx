import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/common/Button';
import UniAlarm from '../../assets/uni/uni-alarm';
import Logo from '../../components/common/Logo';

export default function LaunchScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center' }}>

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content */}
            <View className="items-center px-8">

                {/* Uni character */}
                <UniAlarm width={180} height={180} />

                {/* WA logo */}
                <View className="mt-6">
                    <Logo width={120} height={47} />
                </View>

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
                    shape="square"
                />
            </View>

        </View>
    );
}
