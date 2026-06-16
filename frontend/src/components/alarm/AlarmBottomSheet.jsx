import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable } from 'react-native';
import WeekDays from './WeekDays'

//tentative
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AlarmBottomSheet({ visible, onClose, onSave, initialValue }) {
    const [label, setLabel] = useState('')
    const [hour, setHour] = useState('8')
    const [minute, setMinute] = useState('00')
    const [meridiem, setMeridiem] = useState('AM')
    const [selectedDays, setSelectedDays] = useState([])

    useEffect(() => {
        if (!visible) return
        if (initialValue) {
            setLabel(initialValue.label || '')
            setHour(String(initialValue.hour))
            setMinute(String(initialValue.minute).padStart(2, '0'))
            setMeridiem(initialValue.meridiem || 'AM')
            setSelectedDays(initialValue.days || [])
        } else {
            setLabel('')
            setHour('8')
            setMinute('00')
            setMeridiem('AM')
            setSelectedDays([])
        }
    }, [visible])

    const toggleDay = (dayName) => {
        setSelectedDays((prev) =>
            prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
        )
    }

    const handleSave = () => {
        onSave({
            label,
            hour: parseInt(hour) || 8,
            minute: parseInt(minute) || 0,
            meridiem,
            days: selectedDays,
            enabled: true,
        })
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-3xl px-5 pt-5 pb-10">

                    {/* header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Pressable onPress={onClose}>
                            <Text className="text-gray-500 text-lg">Cancel</Text>
                        </Pressable>
                        <Text className="text-black text-xl font-bold">Set alarm</Text>
                        <Pressable onPress={handleSave}>
                            <Text className="text-black text-lg font-semibold">Save</Text>
                        </Pressable>
                    </View>

                    {/* Label */}
                    <Text className="text-sm font-bold text-black mb-2">Label</Text>
                    <TextInput
                        placeholder="Label"
                        value={label}
                        onChangeText={setLabel}
                    />

                    {/* Time */}
                    <View className="flex-row items-start gap-3 mb-6">
                        {/* Hour */}
                        <View className="w-24 gap-2">
                            <View className="h-20 rounded-2xl bg-[#F2ECE4] items-center justify-center">
                                <TextInput
                                    className="w-full text-center text-5xl font-bold text-[#3D2A1C]"
                                    style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                                    value={hour}
                                    onChangeText={setHour}
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                            <Text className="text-base font-semibold text-[#3D2A1C]">Hour</Text>
                        </View>

                        {/* colon */}
                        <View className="h-20 justify-center gap-2">
                            <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        </View>

                        {/* Minutes */}
                        <View className="w-24 gap-2">
                            <View className="h-20 rounded-2xl bg-[#F2ECE4] items-center justify-center">
                                <TextInput
                                    className="w-full text-center text-5xl font-bold text-[#3D2A1C]"
                                    style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                                    value={minute}
                                    onChangeText={setMinute}
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                            <Text className="text-base font-semibold text-[#3D2A1C]">Minutes</Text>
                        </View>
                        {/* AM/PM (Period_Selector: 52x80, radius 8, border #3D2A1C, bg Uni-50) */}
                        <View className="w-[52px] h-20 rounded-lg overflow-hidden border border-[#3D2A1C]">
                            <Pressable
                                onPress={() => setMeridiem('AM')}
                                className={`flex-1 items-center justify-center ${meridiem === 'AM' ? 'bg-gray-500' : 'bg-gray-50'}`}
                            >
                                <Text className="text-base font-bold text-[#3D2A1C]">AM</Text>
                            </Pressable>
                            <View className="h-px bg-[#3D2A1C]" />
                            <Pressable
                                onPress={() => setMeridiem('PM')}
                                className={`flex-1 items-center justify-center ${meridiem === 'PM' ? 'bg-gray-500' : 'bg-gray-50'}`}
                            >
                                <Text className="text-base font-bold text-[#3D2A1C]">PM</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Days */}
                    <Text className="text-sm font-bold text-black mb-2">Day of week</Text>
                    <WeekDays selected={selectedDays} onToggle={toggleDay} spread />

                </View>
            </View>
        </Modal>
    )
}