import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, NativeModules, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import AlarmCard from '../components/alarm/AlarmCard';
import AlarmBottomSheet from '../components/alarm/AlarmBottomSheet'
import AlarmMenu from '../components/alarm/AlarmMenu'

const { AlarmModule } = NativeModules;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const mapAlarmFromApi = (a) => {
    const [h24, m] = a.alarmTime.split(':').map(Number)
    const meridiem = h24 >= 12 ? 'PM' : 'AM'
    let hour = h24 % 12
    if (hour === 0) hour = 12
    return {
        id: a._id,
        label: '',
        hour,
        minute: m,
        meridiem,
        days: [DAY_NAMES[a.dayOfWeek]],
        enabled: a.isActive,
    }
}

const getNextTimestamp = (hour, minute, meridiem) => {
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
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSheet, setShowSheet] = useState(false)
    const [menuAlarmId, setMenuAlarmId] = useState(null)

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const res = await apiClient.get('/api/alarms')
                setAlarms((res.data.data || []).map(mapAlarmFromApi))
            } catch (err) {
                console.error('[AlarmListScreen] fetchAlarms error:', err?.response?.status, err?.response?.data)
            } finally {
                setLoading(false)
            }
        }
        fetchAlarms()
    }, [])

    // toggle
    const toggleAlarm = (id) => {
        setAlarms((prev) =>
            prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
        )
    }

    const handleSaveAlarm = ({ label, hour, minute, meridiem, days }) => {
        const newAlarm = {
            id: String(Date.now()),
            label,
            hour,
            minute,
            meridiem,
            days: days ?? [],
            enabled: true,
        }
        setAlarms((prev) => [...prev, newAlarm])
        setShowSheet(false)
    }

    const openMenu = (id) => {
        setMenuAlarmId(id)
    }

    const deleteAlarm = (id) => {
        setAlarms((prev) => prev.filter((a) => a.id !== id))
        setMenuAlarmId(null)
    }

    return (
        <View className="flex-1 bg-white px-4 pt-12">
            <Text className="text-3xl font-bold text-black mt-4 mb-4">Alarms</Text>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : (
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
            )}

            {/* FAB */}
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
            <AlarmMenu
                visible={menuAlarmId !== null}
                onClose={() => setMenuAlarmId(null)}
                onDelete={() => deleteAlarm(menuAlarmId)}
            />
        </View>
    )
}