import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable } from 'react-native';

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
                    <View className="flex-row items-center mb-6">
                        <TextInput
                            className="text-4xl font-bold"
                            value={hour}
                            onChangeText={setHour}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Text className="text-4xl font-bold">:</Text>
                        <TextInput
                            className="text-4xl font-bold"
                            value={minute}
                            onChangeText={setMinute}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <View>
                            <Pressable
                                onPress={() => setMeridiem('AM')}
                                className={`px-4 py-3 ${meridiem === 'AM' ? 'bg-black' : 'bg-gray-100'}`}
                            >
                                <Text className={`font-bold ${meridiem === 'AM' ? 'text-white' : 'text-gray-500'}`}>AM</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setMeridiem('PM')}
                                className={`px-4 py-3 ${meridiem === 'PM' ? 'bg-black' : 'bg-gray-100'}`}
                            >
                                <Text className={`font-bold ${meridiem === 'PM' ? 'text-white' : 'text-gray-500'}`}>PM</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Days */}
                    <Text className="text-sm font-bold text-black mb-2">Day of week</Text>
                    <View className="flex-row justify-between">
                        {DAYS.map((day, index) => {
                            const dayName = DAY_NAMES[index]
                            const isSelected = selectedDays.includes(dayName)
                            return (
                                <Pressable key={index} onPress={() => toggleDay(dayName)}>
                                    <Text>{isSelected ? `[${day}]` : day}</Text>
                                </Pressable>
                            )
                        })}
                    </View>

                </View>
            </View>
        </Modal>
    )
}