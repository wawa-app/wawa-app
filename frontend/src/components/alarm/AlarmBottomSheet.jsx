import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, Keyboard } from 'react-native';
import WeekDays from './WeekDays'
import { Label, Close } from '../icons'

//tentative
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AlarmBottomSheet({ visible, onClose, onSave, initialValue }) {
    const [label, setLabel] = useState('')
    const [hour, setHour] = useState('8')
    const [minute, setMinute] = useState('00')
    const [meridiem, setMeridiem] = useState('AM')
    const [selectedDays, setSelectedDays] = useState([])
    const [labelFocused, setLabelFocused] = useState(false)

    const handleHourChange = (text) => {
        const value = text.replace(/[^0-9]/g, '')

        if (value === '') {
            setHour('')
            return
        }

        const number = parseInt(value)

        if (number > 12) {
            setHour('12')
        } else if (number < 1) {
            setHour('1')
        } else {
            setHour(value)
        }
    }

    const handleMinuteChange = (text) => {
        const value = text.replace(/[^0-9]/g, '')

        if (value === '') {
            setMinute('')
            return
        }

        const number = parseInt(value)

        if (number > 59) {
            setMinute('59')
        } else {
            setMinute(value)
        }
    }

    const padHourOnBlur = () => {
        if (hour === '') {
            setHour('12')
            return
        }
        setHour(String(parseInt(hour)).padStart(2, '0'))
    }

    const padMinuteOnBlur = () => {
        if (minute === '') {
            setMinute('00')
            return
        }
        setMinute(String(parseInt(minute)).padStart(2, '0'))
    }

    useEffect(() => {
        if (!visible) return
        if (initialValue) {
            setLabel(initialValue.label || '')
            setHour(String(initialValue.hour).padStart(2, '0'))
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
        Keyboard.dismiss()
        setSelectedDays((prev) =>
            prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
        )
    }

    const handleSave = () => {
        const safeHour = Math.min(Math.max(parseInt(hour) || 8, 1), 12)
        const safeMinute = Math.min(Math.max(parseInt(minute) || 0, 0), 59)

        onSave({
            label,
            hour: safeHour,
            minute: safeMinute,
            meridiem,
            days: selectedDays,
            enabled: true,
        })
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/40">

                {/* sheet body */}
                <View
                    className="bg-Base-Paper items-start"
                    style={{ height: 572, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
                >
                    {/* scroll content */}
                    <View className="w-full items-center gap-Space-spacing-xl px-Space-spacing-lg pt-Space-spacing-xl">

                        {/* header */}
                        <View className="flex-row items-center justify-between self-stretch">
                            <Pressable onPress={onClose}>
                                <Text className="text-label-large font-geologica-medium text-Neutral-Gray-500">Cancel</Text>
                            </Pressable>
                            <Text className="text-title-large font-geologica-bold text-Base-OnPaper">Set alarm</Text>
                            <Pressable onPress={handleSave}>
                                <Text className="text-label-large font-geologica-medium text-Base-OnPaper">Save</Text>
                            </Pressable>
                        </View>

                        {/* Label */}
                        <View className="self-stretch gap-Space-spacing-sm">
                            <Text className="text-label-large font-geologica-medium text-Base-OnPaper">Label</Text>

                            <View
                                className="flex-row items-center self-stretch bg-Neutral-brandWarm-50"
                                style={{
                                    height: 56,
                                    paddingHorizontal: 16,
                                    gap: 16,
                                    borderRadius: 8,
                                    borderWidth: labelFocused ? 2 : 1,
                                    borderColor: labelFocused ? '#FF6D00' : '#3D2A1C',
                                }}
                            >
                                <Label width={24} height={24} />
                                <TextInput
                                    placeholder="Label"
                                    placeholderTextColor="rgba(38,28,20,0.38)"
                                    value={label}
                                    onChangeText={setLabel}
                                    onFocus={() => setLabelFocused(true)}
                                    onBlur={() => setLabelFocused(false)}
                                    className="flex-1 text-label-large font-geologica-medium text-Base-OnPaper"
                                    style={{ padding: 0 }}
                                />
                                {label.length > 0 && (
                                    <Pressable onPress={() => setLabel('')} hitSlop={8}>
                                        <Close width={24} height={24} />
                                    </Pressable>
                                )}
                            </View>
                        </View>

                        {/* Time */}
                        <View className="flex-row items-start self-stretch" style={{ gap: 8 }}>
                            {/* Hour */}
                            <View className="flex-1 gap-Space-spacing-sm">
                                <View
                                    className="items-center justify-center self-stretch bg-Neutral-Gray-300"
                                    style={{ height: 72, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }}
                                >
                                    <TextInput
                                        className="w-full text-center text-display-medium font-geologica-black text-Base-OnSurface"
                                        style={{ padding: 0, includeFontPadding: false, textAlignVertical: 'center' }}
                                        value={hour}
                                        onChangeText={handleHourChange}
                                        onBlur={padHourOnBlur}
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                </View>
                                <Text className="text-label-large font-geologica-medium text-Base-OnPaper">Hour</Text>
                            </View>

                            {/* colon */}
                            <View className="items-center justify-center gap-Space-spacing-sm" style={{ height: 72, width: 24 }}>
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5E5E5E' }} />
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5E5E5E' }} />
                            </View>

                            {/* Minutes */}
                            <View className="flex-1 gap-Space-spacing-sm">
                                <View
                                    className="items-center justify-center self-stretch bg-Neutral-Gray-300"
                                    style={{ height: 72, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }}
                                >
                                    <TextInput
                                        className="w-full text-center text-display-medium font-geologica-black text-Base-OnSurface"
                                        style={{ padding: 0, includeFontPadding: false, textAlignVertical: 'center' }}
                                        value={minute}
                                        onChangeText={handleMinuteChange}
                                        onBlur={padMinuteOnBlur}
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                </View>
                                <Text className="text-label-large font-geologica-medium text-Base-OnPaper">Minutes</Text>
                            </View>

                            {/* AM/PM */}
                            <View
                                className="overflow-hidden"
                                style={{ width: 52, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#3D2A1C' }}
                            >
                                <Pressable
                                    onPress={() => { Keyboard.dismiss(); setMeridiem('AM') }}
                                    className={`flex-1 items-center justify-center ${meridiem === 'AM' ? 'bg-Brand-Primary' : 'bg-Uni-50'}`}
                                    style={{ borderBottomWidth: 1, borderBottomColor: '#261C14' }}
                                >
                                    <Text className="text-label-large font-geologica-medium text-Base-OnPaper">AM</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => { Keyboard.dismiss(); setMeridiem('PM') }}
                                    className={`flex-1 items-center justify-center ${meridiem === 'PM' ? 'bg-Brand-Primary' : 'bg-Uni-50'}`}
                                >
                                    <Text className="text-label-large font-geologica-medium text-Base-OnPaper">PM</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Days */}
                        <View className="self-stretch gap-Space-spacing-sm">
                            <Text className="text-label-large font-geologica-medium text-Base-OnPaper">Day of week</Text>
                            <WeekDays selected={selectedDays} onToggle={toggleDay} spread />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}