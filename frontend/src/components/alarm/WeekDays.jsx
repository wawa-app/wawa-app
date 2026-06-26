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

const SHADOW_SM = '0px 1px 3px 0px rgba(26, 15, 7, 0.08)';

export default function WeekDays({ selected = [], onToggle, spread = false }) {
    return (
        <View className={`flex-row items-center ${spread ? 'w-full justify-between' : ''}`} style={spread ? undefined : { gap: 12 }}>
            {DAYS.map((d, i) => {
                const active = selected.includes(d.name);
                const Wrapper = onToggle ? Pressable : View;
                return (
                    <Wrapper
                        key={`${d.name}-${i}`}
                        onPress={onToggle ? () => onToggle(d.name) : undefined}
                        className={`items-center justify-center ${active ? 'bg-Brand-Primary' : 'bg-Base-Surface'}`}
                        style={{ width: 36, height: 36, borderRadius: 18, boxShadow: SHADOW_SM }}
                    >
                        <Text className="text-label-large font-geologica-medium text-Base-OnPaper">
                            {d.letter}
                        </Text>
                    </Wrapper>
                );
            })}
        </View>
    );
}