import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
// import { View, Text, ScrollView, Pressable, NativeModules } from 'react-native';
import AlarmCard from '../components/alarm/AlarmCard';
import AlarmBottomSheet from '../components/alarm/AlarmBottomSheet'

// const { AlarmModule } = NativeModules;
//tentative data
const MOCK_ALARMS = [
    { id: '1', label: 'Label', hour: 8, minute: 0, meridiem: 'AM', days: ['Mon', 'Tue', 'Wed'], enabled: true },
    { id: '2', label: '', hour: 8, minute: 0, meridiem: 'PM', days: ['Mon', 'Tue', 'Wed'], enabled: false },
]

export default function AlarmListScreen({ navigation }) {
    const [alarms, setAlarms] = useState(MOCK_ALARMS)
    const [showSheet, setShowSheet] = useState(false)

    // toggle
    const toggleAlarm = (id) => {
        setAlarms((prev) =>
            prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
        )
    }

    const openMenu = (id) => {
        console.log('menu for', id) // tentative
    }

    // const addAlarm = () => {
    //     console.log('add alarm') // tentative
    // }

    return (
        <View className="flex-1 bg-white px-4 pt-12">
            <Text className="text-3xl font-bold text-black mt-4 mb-4">Alarms</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {alarms.map((alarm) => (
                    <AlarmCard
                        key={alarm.id}
                        alarm={alarm}
                        onToggle={() => toggleAlarm(alarm.id)}
                        onMenu={() => openMenu(alarm.id)}
                    />
                ))}
            </ScrollView>
            {/* <Pressable
                onPress={() => AlarmModule.setAlarm(9999, Date.now() + 15000)}
                className="absolute bottom-24 right-6 bg-red-500 px-4 py-3 rounded-full"
            >
                <Text className="text-white">Test (15s)</Text>
            </Pressable> */}
            {/* FAB - tentative */}
            <Pressable
                onPress={() => setShowSheet(true)}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-black items-center justify-center"
            >
                <Text className="text-white text-3xl leading-none">+</Text>
            </Pressable>
            <AlarmBottomSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
            />
        </View>
    )
}