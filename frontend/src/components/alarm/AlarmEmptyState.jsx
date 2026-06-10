import React from 'react';
import { View, Text } from 'react-native';

export default function AlarmEmptyState() {
    return (
        <View className="flex-1 items-center pt-20 px-6">
            <Text className="text-xl font-bold text-black mb-3">No Alarm Set</Text>
            <Text className="text-base text-gray-500 text-center">
                Tap the "+" button at the bottom right of the screen to create your morning routine.
            </Text>
        </View>
    )
}