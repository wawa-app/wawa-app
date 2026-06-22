import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';

const ClockIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 6v6l4 2" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5 21.5 6.753 21.5 12z" stroke="black" strokeWidth={1.5} />
        <Path d="M12 6v6l3 3" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M19 19l2 2" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function WalkthroughStep3Screen({ navigation, route }) {
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('00');
    const [isAM, setIsAM] = useState(true);

    const handleSetAlarm = () => {
        const alarmTime = `${hour}:${minute} ${isAM ? 'AM' : 'PM'}`;
        navigation.navigate('WalkthroughAllDone', { alarmTime });
    };

    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Stepper */}
            <Stepper currentStep={3} steps={WALKTHROUGH_STEPS} />

            {/* gap: 17px */}
            <View className="h-[17px]" />

            {/* Title */}
            <Text className="text-[24px] font-bold text-black text-center leading-[24px] px-8">
                Alarm Preparation
            </Text>

            {/* gap: 37px */}
            <View className="h-[37px]" />

            {/* Clock icon */}
            <View className="items-center">
                <ClockIcon />
            </View>

            {/* gap: 95px */}
            <View className="h-[95px]" />

            {/* Time picker */}
            <View className="flex-row items-center justify-center" style={{ gap: 21 }}>

                {/* Hour picker */}
                <View style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        snapToInterval={40}
                        decelerationRate="fast"
                        style={{ height: 40 }}
                        contentContainerStyle={{ paddingVertical: 0 }}
                    >
                        {HOURS.map(h => (
                            <TouchableOpacity key={h} onPress={() => setHour(h)} style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, fontWeight: '500', color: hour === h ? '#000' : '#999' }}>
                                    {h}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Text className="text-[11px] text-[#666] mt-1">Hour</Text>
                </View>

                {/* Colon */}
                <Text style={{ fontSize: 32, fontWeight: '500', color: '#000', marginBottom: 16 }}>:</Text>

                {/* Minute picker */}
                <View style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        snapToInterval={40}
                        decelerationRate="fast"
                        style={{ height: 40 }}
                    >
                        {MINUTES.map(m => (
                            <TouchableOpacity key={m} onPress={() => setMinute(m)} style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, fontWeight: '500', color: minute === m ? '#000' : '#999' }}>
                                    {m}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Text className="text-[11px] text-[#666] mt-1">Minute</Text>
                </View>

                {/* AM/PM toggle */}
                <View style={{ borderRadius: 8, backgroundColor: '#F0F0F0', overflow: 'hidden', marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => setIsAM(true)}
                        style={{
                            width: 48,
                            height: 36,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: isAM ? '#fff' : 'transparent',
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: isAM ? '600' : '400', color: '#000' }}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsAM(false)}
                        style={{
                            width: 48,
                            height: 36,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: !isAM ? '#fff' : 'transparent',
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: !isAM ? '600' : '400', color: '#000' }}>PM</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button */}
            <View className="w-[296px] self-center pb-[101px]">
                <Button title="Set Alarm" onPress={handleSetAlarm} fullWidth />
            </View>

        </View>
    );
}
