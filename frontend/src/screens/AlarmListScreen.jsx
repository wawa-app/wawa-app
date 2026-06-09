import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, NativeModules, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/client';
import AlarmCard from '../components/alarm/AlarmCard';
import AlarmBottomSheet from '../components/alarm/AlarmBottomSheet'
import AlarmMenu from '../components/alarm/AlarmMenu'

const { AlarmModule } = NativeModules;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const toRequestCode = (id) => parseInt(id.slice(-6), 16)

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
        days: (a.daysOfWeek || []).map((d) => DAY_NAMES[d]),
        enabled: a.isActive,
    }
}

//create
const mapAlarmToApi = ({ hour, minute, meridiem, days }) => {
    let h24 = hour % 12
    if (meridiem === 'PM') h24 += 12
    return {
        alarmTime: `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        daysOfWeek: (days || []).map((name) => DAY_NAMES.indexOf(name)),
    }
}

const getNextTimestamp = (hour, minute, meridiem, days) => {
    let h = hour % 12
    if (meridiem === 'PM') h += 12
    const now = new Date()
    for (let i = 0; i < 8; i++) {
        const cand = new Date(now)
        cand.setDate(now.getDate() + i)
        cand.setHours(h, minute, 0, 0)
        if (days.includes(DAY_NAMES[cand.getDay()]) && cand.getTime() > now.getTime()) {
            return cand.getTime()
        }
    }
    return null
}

const syncNative = (alarm) => {
    const code = toRequestCode(alarm.id)
    if (alarm.enabled) {
        const ts = getNextTimestamp(alarm.hour, alarm.minute, alarm.meridiem, alarm.days)
        if (ts) AlarmModule.setAlarm(code, ts)
    } else {
        AlarmModule.cancelAlarm(code)
    }
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
                const mapped = (res.data.data || []).map(mapAlarmFromApi)
                setAlarms(mapped)
                mapped.forEach(syncNative)
            } catch (err) {
                console.error('[AlarmListScreen] fetchAlarms error:', err?.response?.status, err?.response?.data)
            } finally {
                setLoading(false)
            }
        }
        fetchAlarms()
    }, [])

    // toggle
    const toggleAlarm = async (id) => {
        const target = alarms.find((a) => a.id === id)
        if (!target) return
        const nextEnabled = !target.enabled

        setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: nextEnabled } : a)))

        try {
            await apiClient.put(`/api/alarms/${id}`, { isActive: nextEnabled })
            syncNative({ ...target, enabled: nextEnabled })
        } catch (err) {
            setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !nextEnabled } : a)))
            console.error('[AlarmListScreen] toggleAlarm error:', err?.response?.status, err?.response?.data)
        }
    }

    // post
    const handleSaveAlarm = async ({ hour, minute, meridiem, days }) => {
        if (!days || days.length === 0) {
            Alert.alert('Select days', 'Pick at least one day of the week.')
            return
        }
        try {
            const res = await apiClient.post('/api/alarms', mapAlarmToApi({ hour, minute, meridiem, days }))
            const created = mapAlarmFromApi(res.data.data)
            setAlarms((prev) => [...prev, created])
            syncNative(created)
            setShowSheet(false)
        } catch (err) {
            const data = err?.response?.data
            console.error('[AlarmListScreen] createAlarm error:', err?.response?.status, data)
            if (data?.error?.startsWith('MAX_')) {
                Alert.alert('Limit reached', data.message || 'Alarm limit reached.')
            }
        }
    }

    const openMenu = (id) => {
        setMenuAlarmId(id)
    }

    // delete
    const deleteAlarm = async (id) => {
        const target = alarms.find((a) => a.id === id)
        try {
            await apiClient.delete(`/api/alarms/${id}`)
            if (target) AlarmModule.cancelAlarm(toRequestCode(target.id))
            setAlarms((prev) => prev.filter((a) => a.id !== id))
        } catch (err) {
            console.error('[AlarmListScreen] deleteAlarm error:', err?.response?.status, err?.response?.data)
        } finally {
            setMenuAlarmId(null)
        }
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