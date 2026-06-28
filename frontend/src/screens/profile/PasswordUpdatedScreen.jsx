import React from 'react';
import { View, Text } from 'react-native';
import { Check } from '../../components/icons';
import Button from '../../components/common/Button';

export default function PasswordUpdatedScreen({ navigation }) {
    return (
        <View className="flex-1 bg-Base-Background items-center justify-center px-6">
            <View className="w-32 h-32 rounded-full bg-Base-Paper items-center justify-center mb-6">
                <Check size={72} />
            </View>
            <Text className="text-[24px] font-bold text-Base-OnBackground text-center mb-2">
                Your Password Was Successfully Updated
            </Text>
            <Text className="text-[16px] font-geologica-regular text-Base-OnBackground text-center mb-16">
                WaWa now is ready for a new challenge
            </Text>
            <View className="w-full">
                <Button title="Back to Account" onPress={() => navigation.navigate('Profile')} fullWidth shape="round" />
            </View>
        </View>
    );
}
