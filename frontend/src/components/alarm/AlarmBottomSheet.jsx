import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable } from 'react-native';

//tentative
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AlarmBottomSheet({ visible, onClose }) {
    const [label, setLabel] = useState('')
    const [hour, setHour] = useState('8')
    const [minute, setMinute] = useState('00')
    const [meridiem, setMeridiem] = useState('AM')
    const [selectedDays, setSelectedDays] = useState([])

    const toggleDay = (dayName) => {
        setSelectedDays((prev) =>
            prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
        )
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', padding: 20 }}>

                    {/* Label */}
                    <TextInput
                        placeholder="Label"
                        value={label}
                        onChangeText={setLabel}
                    />

                    {/* Time */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={hour}
                            onChangeText={setHour}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Text>:</Text>
                        <TextInput
                            value={minute}
                            onChangeText={setMinute}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Pressable onPress={() => setMeridiem('AM')}>
                            <Text>{meridiem === 'AM' ? '[AM]' : 'AM'}</Text>
                        </Pressable>
                        <Pressable onPress={() => setMeridiem('PM')}>
                            <Text>{meridiem === 'PM' ? '[PM]' : 'PM'}</Text>
                        </Pressable>
                    </View>

                    {/* Days */}
                    <View style={{ flexDirection: 'row' }}>
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