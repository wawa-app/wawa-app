import React from 'react';
import { View, Text, Pressable } from 'react-native';

const DAYS = [
    { name: 'Sun', letter: 'S' },
    { name: 'Mon', letter: 'M' },
    { name: 'Tue', letter: 'T' },
    { name: 'Wed', letter: 'W' },
    { name: 'Thu', letter: 'T' },
    { name: 'Fri', letter: 'F' },
    { name: 'Sat', letter: 'S' },
];

export default function WeekDays({ selected = [], onToggle, size = 32, spread = false }) {
    return (
        <View className={`flex-row items-center ${spread ? 'w-full justify-between' : 'gap-3'}`}>
            {DAYS.map((d) => {
                const active = selected.includes(d.name);
                const Wrapper = onToggle ? Pressable : View;
                return (
                    <Wrapper
                        key={d.name}
                        onPress={onToggle ? () => onToggle(d.name) : undefined}
                        style={{ width: size, height: size, borderRadius: size / 2 }}
                        className={`items-center justify-center ${active ? 'bg-black' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-xs ${active ? 'text-white' : 'text-gray-500'}`}>
                            {d.letter}
                        </Text>
                    </Wrapper>
                );
            })}
        </View>
    );
}