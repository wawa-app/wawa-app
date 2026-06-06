import React from 'react';
import { View, Text, Switch, Pressable } from 'react-native';

export default function AlarmCard({ alarm, onToggle, onMenu }) {
    const { label, hour, minute, meridiem, days, enabled } = alarm

    return (
        <View className={`w-full h-[136px] p-4 rounded-lg bg-[#D2D2D2] ${enabled ? '' : 'opacity-50'}`}>
            {/* Label */}
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-base text-gray-700">{label || 'Label'}</Text>
                <Pressable onPress={onMenu} hitSlop={8}>
                    <Text className="text-xl text-gray-700">⋮</Text>
                </Pressable>
            </View>

            {/* Time */}
            <View className="flex-row items-end mt-1">
                <Text className="text-4xl font-bold text-black">
                    {hour}:{String(minute).padStart(2, '0')}
                </Text>
                <Text className="text-lg text-black mb-1 ml-1">{meridiem}</Text>
            </View>

            {/* Week, toggle */}
            <View className="flex-row justify-between items-center w-full mt-auto">
                <Text className="text-sm text-gray-700">{days.join(', ')}</Text>
                <Switch value={enabled} onValueChange={onToggle} />
            </View>
        </View>
    )
}