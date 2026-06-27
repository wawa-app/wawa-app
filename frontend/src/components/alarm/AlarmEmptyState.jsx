import React from 'react';
import { View, Text } from 'react-native';

export default function AlarmEmptyState() {
    return (
        <View className="flex-1 items-center pt-20 px-Space-spacing-lg">
            <Text className="text-title-large font-geologica-bold text-center mb-Space-spacing-lg" style={{ color: '#000' }}>
                No Alarm Set
            </Text>
            <Text className="text-body-large font-geologica text-center" style={{ color: '#000' }}>
                Tap the "+" button at the bottom right of the screen to create your morning routine.
            </Text>
        </View>
    )
}