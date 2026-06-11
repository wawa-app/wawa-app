import React from 'react';
import { View, Text, Pressable, NativeModules } from 'react-native';

const { AlarmModule } = NativeModules

export default function AlarmRingingScreen(props) {
    const time = props?.time ?? '07:00'
    const date = props?.date ?? 'MONDAY, MAY 19'

    const onStartMission = async () => {
        try {
            const unlocked = await AlarmModule.requestDismissKeyguard();
            if (unlocked) {
                AlarmModule.stopAlarm();
            } else {
                console.log('cancelled(Locked)');
            }
        } catch (e) {
            console.warn('dismiss error', e);
        }
    }

    return (
        <View className="flex-1 bg-background justify-between py-20 px-6">
            <View className="items-center mt-16">
                <Text className="text-on-background text-8xl">{time}</Text>
                <Text className="text-on-surface text-xl tracking-widest mt-2">{date}</Text>
            </View>

            <Pressable
                onPress={onStartMission}
                className="bg-on-background rounded-3xl py-5 items-center active:opacity-80"
            >
                <Text className="text-background text-lg">Start mission</Text>
            </Pressable>
        </View>
    )
}