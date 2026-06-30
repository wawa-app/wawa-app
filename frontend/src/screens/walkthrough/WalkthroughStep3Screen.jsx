import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, Keyboard, TextInput } from 'react-native';
import Svg, { Mask, Rect, G, Circle, Path } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';
import WeekDays from '../../components/alarm/WeekDays';
import apiClient from '../../api/client';

const AlarmIcon = () => (
    <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <Mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="72" height="72">
            <Rect width="72" height="72" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0)">
            <Circle cx="36" cy="38.2119" r="17.25" stroke="#1A0F07" strokeWidth="4.5" />
            <Path d="M36 27.5479V39.0002C36 39.8287 36.6716 40.5002 37.5 40.5002H42.5" stroke="#1A0F07" strokeWidth="3" strokeLinecap="round" />
            <Path d="M49.9751 12C53.5648 12.0001 56.4751 14.8719 56.4751 18.4141C56.475 21.0532 54.8587 23.3184 52.5503 24.3027C50.201 21.4722 47.0667 19.3169 43.481 18.1709C43.6104 14.7412 46.4677 12 49.9751 12Z" fill="#1A0F07" />
            <Path d="M21.5005 12C17.9106 12 15.0005 14.8718 15.0005 18.4141C15.0006 21.0533 16.6168 23.3185 18.9253 24.3027C21.2744 21.4725 24.4083 19.3179 27.9937 18.1719C27.8647 14.7418 25.0082 12 21.5005 12Z" fill="#1A0F07" />
        </G>
    </Svg>
);

export default function WalkthroughStep3Screen({ navigation, route }) {
    const photos = route.params?.photos ?? [];
    const [hour, setHour] = useState('8');
    const [minute, setMinute] = useState('00');
    const [meridiem, setMeridiem] = useState('AM');
    const [selectedDays, setSelectedDays] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleHourChange = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        if (value === '') { setHour(''); return; }
        const n = parseInt(value);
        setHour(n > 12 ? '12' : n < 1 ? '1' : value);
    };

    const handleMinuteChange = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        if (value === '') { setMinute(''); return; }
        const n = parseInt(value);
        setMinute(n > 59 ? '59' : value);
    };

    const padHour = () => {
        if (hour === '') { setHour('12'); return; }
        setHour(String(parseInt(hour)).padStart(2, '0'));
    };

    const padMinute = () => {
        if (minute === '') { setMinute('00'); return; }
        setMinute(String(parseInt(minute)).padStart(2, '0'));
    };

    const toggleDay = (dayName) => {
        Keyboard.dismiss();
        setSelectedDays(prev =>
            prev.includes(dayName) ? prev.filter(d => d !== dayName) : [...prev, dayName]
        );
    };

    const to24h = () => {
        let h = parseInt(hour) || 8;
        if (meridiem === 'AM' && h === 12) h = 0;
        if (meridiem === 'PM' && h !== 12) h += 12;
        return `${String(h).padStart(2, '0')}:${minute.padStart(2, '0')}`;
    };

    const handleSetAlarm = async () => {
        if (selectedDays.length === 0) {
            Alert.alert('Select days', 'Please select at least one day of the week.');
            return;
        }
        try {
            setLoading(true);
            const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // Save all walkthrough photos to backend (batch)
            await Promise.all(
                photos.map(p =>
                    apiClient.post('/api/onboarding/photo-challenge', {
                        name: p.label,
                        localRef: [p.uri],
                    })
                )
            );

            // Save alarm
            await apiClient.post('/api/alarms', {
                alarmTime: to24h(),
                daysOfWeek: selectedDays.map(name => DAY_NAMES.indexOf(name)),
                label: 'WaWa Alarm',
            });
            navigation.navigate('WalkthroughAllDone');
        } catch (err) {
            const code = err.response?.data?.error;
            if (code === 'INSUFFICIENT_OBJECTS') {
                Alert.alert('Error', 'Please take at least 10 photos first.');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>

            {/* Status bar */}
            <View style={{ height: 24 }} />

            {/* Header zone */}
            <View style={{ height: 64 }} />

            {/* Stepper */}
            <Stepper currentStep={3} steps={WALKTHROUGH_STEPS} />

            {/* gap: 104px */}
            <View style={{ height: 104 }} />

            {/* Title */}
            <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 24, lineHeight: 32 }}>
                Alarm Preparation
            </Text>

            {/* gap: 37px */}
            <View style={{ height: 37 }} />

            {/* Alarm icon in circle frame */}
            <View style={{ alignItems: 'center' }}>
                <View style={{
                    padding: 19,
                    borderRadius: 55,
                    borderWidth: 0.1,
                    borderColor: '#595858',
                    backgroundColor: '#FFE0B2',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <AlarmIcon />
                </View>
            </View>

            {/* gap: 48px */}
            <View style={{ height: 48 }} />

            {/* Time picker */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 32, gap: 8 }}>

                {/* Hour */}
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ height: 72, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: '100%', textAlign: 'center', fontSize: 40, fontWeight: '900', color: '#1A0F07', padding: 0, includeFontPadding: false }}
                            value={hour}
                            onChangeText={handleHourChange}
                            onBlur={padHour}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                    </View>
                    <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06 }}>Hour</Text>
                </View>

                {/* Colon */}
                <View style={{ height: 72, width: 24, justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5E5E5E' }} />
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5E5E5E' }} />
                </View>

                {/* Minutes */}
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ height: 72, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: '100%', textAlign: 'center', fontSize: 40, fontWeight: '900', color: '#1A0F07', padding: 0, includeFontPadding: false }}
                            value={minute}
                            onChangeText={handleMinuteChange}
                            onBlur={padMinute}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                    </View>
                    <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06 }}>Minutes</Text>
                </View>

                {/* AM/PM */}
                <View style={{ width: 52, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#3D2A1C', overflow: 'hidden' }}>
                    <Pressable
                        onPress={() => { Keyboard.dismiss(); setMeridiem('AM'); }}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: meridiem === 'AM' ? '#FF8400' : '#FFF3CD', borderBottomWidth: 1, borderBottomColor: '#261C14' }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A0F07' }}>AM</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { Keyboard.dismiss(); setMeridiem('PM'); }}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: meridiem === 'PM' ? '#FF8400' : '#FFF3CD' }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A0F07' }}>PM</Text>
                    </Pressable>
                </View>
            </View>

            {/* gap: 24px */}
            <View style={{ height: 24 }} />

            {/* Day of week */}
            <View style={{ paddingHorizontal: 32, gap: 8 }}>
                <Text style={{ fontFamily: 'Geologica-Medium', fontSize: 14, color: '#1A0F07' }}>Day of week</Text>
                <WeekDays selected={selectedDays} onToggle={toggleDay} spread />
            </View>

            {/* Bottom spacer */}
            <View style={{ flex: 1 }} />

            {/* Button */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" size="large" />
                    : <Button title="Set Alarm" onPress={handleSetAlarm} fullWidth shape="square" />
                }
            </View>

        </View>
    );
}
