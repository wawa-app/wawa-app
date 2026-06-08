import React, { useState } from 'react';
// import { View, Text, ScrollView, Pressable } from 'react-native';
import { View, Text, ScrollView, Pressable, NativeModules, Modal } from 'react-native';
import AlarmCard from '../components/alarm/AlarmCard';
import AlarmBottomSheet from '../components/alarm/AlarmBottomSheet'

const { AlarmModule } = NativeModules;
//tentative data
const MOCK_ALARMS = [
    { id: '1', alarmId: 1, label: 'Label', hour: 8, minute: 0, meridiem: 'AM', days: ['Mon', 'Tue', 'Wed'], enabled: true },
    { id: '2', alarmId: 2, label: '', hour: 8, minute: 0, meridiem: 'PM', days: ['Mon', 'Tue', 'Wed'], enabled: false },
]

const getNextTimestamp = (hour, minute, meridiem) => {
    // 12h -> 24h
    let h = hour % 12
    if (meridiem === 'PM') h += 12

    const now = new Date()
    const next = new Date()
    next.setHours(h, minute, 0, 0)

    if (next.getTime() <= now.getTime()) {
        next.setDate(next.getDate() + 1)
    }

    return next.getTime()
}

export default function AlarmListScreen({ navigation }) {
    const [alarms, setAlarms] = useState(MOCK_ALARMS)
    const [showSheet, setShowSheet] = useState(false)
    const [menuAlarmId, setMenuAlarmId] = useState(null)

    // toggle
    const toggleAlarm = (id) => {
        setAlarms((prev) =>
            prev.map((a) => {
                if (a.id !== id) return a

                const nextEnabled = !a.enabled

                if (nextEnabled) {
                    const timestamp = getNextTimestamp(a.hour, a.minute, a.meridiem)
                    AlarmModule.setAlarm(a.alarmId, timestamp)
                } else {
                    AlarmModule.cancelAlarm(a.alarmId)
                }

                return { ...a, enabled: nextEnabled }
            })
        )
    }

    const handleSaveAlarm = ({ label, hour, minute, meridiem, days }) => {
        const nextAlarmId =
            alarms.length > 0
                ? Math.max(...alarms.map((a) => a.alarmId)) + 1
                : 1

        const newAlarm = {
            id: String(Date.now()),
            alarmId: nextAlarmId,
            label,
            hour,
            minute,
            meridiem,
            days: days ?? [],
            enabled: true,
        }

        const timestamp = getNextTimestamp(hour, minute, meridiem)
        AlarmModule.setAlarm(nextAlarmId, timestamp)

        setAlarms((prev) => [...prev, newAlarm])
        setShowSheet(false)
    }

    const openMenu = (id) => {
        setMenuAlarmId(id)
    }

    const deleteAlarm = (id) => {
        setAlarms((prev) => {
            const target = prev.find((a) => a.id === id)
            if (target?.enabled) {
                AlarmModule.cancelAlarm(target.alarmId)
            }
            return prev.filter((a) => a.id !== id)
        })
        setMenuAlarmId(null)
    }

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
                onSave={handleSaveAlarm}
            />
            {/* menu */}
            <Modal
                visible={menuAlarmId !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuAlarmId(null)}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-center items-center"
                    onPress={() => setMenuAlarmId(null)}
                >
                    <Pressable className="bg-white rounded-2xl py-2 w-48">
                        <Pressable
                            onPress={() => {
                                console.log('edit', menuAlarmId) // tentative
                                setMenuAlarmId(null)
                            }}
                            className="px-5 py-3"
                        >
                            <Text className="text-black text-base">Edit</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => deleteAlarm(menuAlarmId)}
                            className="px-5 py-3"
                        >
                            <Text className="text-red-500 text-base">Delete</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}