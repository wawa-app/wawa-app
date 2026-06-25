import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Menu from '../icons/Menu'
import Toggle from '../common/Toggle'

export default function AlarmCard({ alarm, onToggle, onMenu }) {
    const { label, hour, minute, meridiem, days, enabled } = alarm

    return (
        <View className={`w-full p-4 rounded-Radius-radius-sm ${enabled ? 'bg-Base-Surface' : 'bg-Neutral-Gray-300'}`}
            style={{ height: 136 }}>
            {/* Label */}
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-label-large font-geologica-medium text-Base-OnSurface">
                    {label || 'Label'}
                </Text>
                <Pressable onPress={onMenu} hitSlop={8} className="w-Size-size-icon-md h-Size-size-icon-md items-center justify-center">
                    <Menu width={24} height={24} />
                </Pressable>
            </View>

            {/* Time */}
            <View className="flex-row items-end mt-1">
                <Text className="text-display-small font-geologica-bold text-Base-OnSurface">
                    {hour}:{String(minute).padStart(2, '0')}
                </Text>
                <Text className="text-display-small font-geologica-bold text-Base-OnSurface ml-1">
                    {meridiem}
                </Text>
            </View>

            {/* Week, toggle */}
            <View className="flex-row justify-between items-center w-full mt-auto">
                <Text className="text-label-large font-geologica-medium text-Base-OnSurface">
                    {days.join(', ')}
                </Text>
                <Toggle value={enabled} onValueChange={onToggle} />
            </View>
        </View>
    )
}