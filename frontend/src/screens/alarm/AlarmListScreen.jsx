import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Pressable, NativeModules, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../api/client';
import AlarmCard from '../../components/alarm/AlarmCard';
import AlarmBottomSheet from '../../components/alarm/AlarmBottomSheet'
import AlarmEmptyState from '../../components/alarm/AlarmEmptyState'
import { useSnackbar } from '../../components/common/SnackbarProvider';
import Button from '../../components/common/Button';
import Fab from '../../components/common/Fab';
import { getStoredObjectsWithImages } from "../../storage/objectStorage";

const { AlarmModule } = NativeModules;

const REQUIRED_OBJECTS = 3
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const toRequestCode = (id) => parseInt(id.slice(-6), 16)
const isNetworkError = (err) => !err?.response

const mapAlarmFromApi = (a) => {
    const [h24, m] = a.alarmTime.split(':').map(Number)
    const meridiem = h24 >= 12 ? 'PM' : 'AM'
    let hour = h24 % 12
    if (hour === 0) hour = 12
    return {
        id: a._id,
        label: a.label || '',
        hour,
        minute: m,
        meridiem,
        days: (a.daysOfWeek || []).map((d) => DAY_NAMES[d]),
        enabled: a.isActive,
    }
}

//create
const mapAlarmToApi = ({ label, hour, minute, meridiem, days }) => {
    let h24 = hour % 12
    if (meridiem === 'PM') h24 += 12
    return {
        label: label || '',
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
        if (ts) AlarmModule.setAlarm(alarm.id, code, ts)
    } else {
        AlarmModule.cancelAlarm(code)
    }
}

export default function AlarmListScreen({ navigation }) {
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSheet, setShowSheet] = useState(false)
    const [editingAlarm, setEditingAlarm] = useState(null)
    const atLimit = alarms.length >= 3
    const { show } = useSnackbar();
    const [objectCount, setObjectCount] = useState(null);


    const closeSheet = () => {
        setShowSheet(false)
        setEditingAlarm(null)
    }

    const openEdit = (id) => {
        const target = alarms.find((a) => a.id === id)
        if (!target) return
        setEditingAlarm(target)
        setShowSheet(true)
    }

    // put
    const handleUpdateAlarm = async (id, { label, hour, minute, meridiem, days }) => {
        if (!days || days.length === 0) {
            Alert.alert('Select days', 'Pick at least one day of the week.')
            return
        }
        try {
            const res = await apiClient.put(`/api/alarms/${id}`, mapAlarmToApi({ label, hour, minute, meridiem, days }))
            const updated = mapAlarmFromApi(res.data.data)
            setAlarms((prev) => prev.map((a) => (a.id === id ? updated : a)))
            syncNative(updated)
            closeSheet()
            show({ text: 'Alarm updated', tone: 'success', showClose: true })
        } catch (err) {
            console.error('[AlarmListScreen] updateAlarm error:', err?.response?.status, err?.response?.data)
            if (isNetworkError(err)) show({ text: 'Connection failed', tone: 'error' })
        }
    }

    // create / edit 
    const handleSheetSave = (data) => {
        if (editingAlarm) {
            handleUpdateAlarm(editingAlarm.id, data)
        } else {
            handleSaveAlarm(data)
        }
    }
    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const res = await apiClient.get('/api/alarms')
                const mapped = (res.data.data || []).map(mapAlarmFromApi)
                setAlarms(mapped)
                mapped.forEach(syncNative)
            } catch (err) {
                console.error('[AlarmListScreen] fetchAlarms error:', err?.response?.status, err?.response?.data || err?.message, err)
            } finally {
                setLoading(false)
            }
        }
        fetchAlarms()
    }, [])

    useFocusEffect(
        useCallback(() => {
            let active = true;
            (async () => {
                try {
                    const objects = await getStoredObjectsWithImages();
                    if (active) setObjectCount(objects.length);
                } catch (e) {
                    console.warn('[AlarmListScreen] object count failed:', e?.message);
                    if (active) setObjectCount(0);
                }
            })();
            return () => { active = false; }
        }, [])
    )

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
    const handleSaveAlarm = async ({ label, hour, minute, meridiem, days }) => {
        if (!days || days.length === 0) {
            Alert.alert('Select days', 'Pick at least one day of the week.')
            return
        }
        try {
            const res = await apiClient.post('/api/alarms', mapAlarmToApi({ label, hour, minute, meridiem, days }))
            const created = mapAlarmFromApi(res.data.data)
            setAlarms((prev) => [...prev, created])
            syncNative(created)
            setShowSheet(false)
            show({ text: 'Alarm added', tone: 'success', showClose: true })
        } catch (err) {
            const data = err?.response?.data
            console.error('[AlarmListScreen] createAlarm error:', err?.response?.status, data)
            if (isNetworkError(err)) {
                show({ text: 'Connection failed', tone: 'error' })
            } else if (data?.error?.startsWith('MAX_')) {
                Alert.alert('Limit reached', data.message || 'Alarm limit reached.')
            }
        }
    }

    // restore
    const restoreAlarm = async (alarm) => {
        try {
            const res = await apiClient.post('/api/alarms', mapAlarmToApi(alarm))
            const created = mapAlarmFromApi(res.data.data)
            setAlarms((prev) => [...prev, created])
            syncNative(created)
        } catch (err) {
            console.error('[AlarmListScreen] restoreAlarm error:', err?.response?.status, err?.response?.data)
            if (isNetworkError(err)) show({ text: 'Connection failed', tone: 'error' })
        }
    }

    // delete
    const deleteAlarm = async (id) => {
        const target = alarms.find((a) => a.id === id)
        if (!target) return
        try {
            await apiClient.delete(`/api/alarms/${id}`)
            AlarmModule.cancelAlarm(toRequestCode(target.id))
            setAlarms((prev) => prev.filter((a) => a.id !== id))
            show({
                text: 'Alarm Is Deleted',
                actionLabel: 'Undo',
                onAction: () => restoreAlarm(target),
                duration: 6000,
                tone: 'success',
            })
        } catch (err) {
            console.error('[AlarmListScreen] deleteAlarm error:', err?.response?.status, err?.response?.data)
            if (isNetworkError(err)) show({ text: 'Connection failed', tone: 'error' })
        }
    }
    // Gate: must enroll enough objects before using alarms
    if (!loading && objectCount !== null && objectCount < REQUIRED_OBJECTS) {
        return (
            <View className="flex-1 bg-white px-4 pt-12">
                <Text className="text-3xl font-bold text-black mt-4 mb-4">Alarms</Text>
                <Text className="text-xl font-bold text-black mb-3">You should prepare for mission</Text>
                <Text className="text-black mb-6">
                    To use the alarm feature, you must prepare for the mission.
                    Please prepare for the mission on the object list screen.
                </Text>
                <Button
                    title="Move to Objects List"
                    onPress={() => navigation.navigate('Objects')}
                    variant="primary"
                    fullWidth
                />
                {/* Disabled FAB */}
                <View className="absolute bottom-6 right-6">
                    <Fab disabled />
                </View>
            </View>
        );
    }
    return (
        <View className="flex-1 bg-Base-Background px-Space-spacing-lg pt-Space-spacing-xl">
            <Text className="text-headline-large font-geologica-bold text-Base-OnBackground">Alarms</Text>

            {(loading || objectCount === null) ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : alarms.length === 0 ? (
                <AlarmEmptyState />
            ) : (
                <View className="gap-Space-spacing-lg mt-Space-spacing-xl">
                    {alarms.map((alarm) => (
                        <AlarmCard
                            key={alarm.id}
                            alarm={alarm}
                            onToggle={() => toggleAlarm(alarm.id)}
                            onEdit={() => openEdit(alarm.id)}
                            onDelete={() => deleteAlarm(alarm.id)}
                        />
                    ))}
                </View>
            )}

            {/* FAB */}
            <View className="absolute bottom-6 right-6">
                <Fab
                    onPress={() => {
                        setEditingAlarm(null)
                        setShowSheet(true)
                    }}
                    variant="primary"
                    size="regular"
                    disabled={atLimit}
                />
            </View>

            {/* sheet */}
            <AlarmBottomSheet
                visible={showSheet}
                onClose={closeSheet}
                onSave={handleSheetSave}
                initialValue={editingAlarm}
            />
        </View>
    )
}