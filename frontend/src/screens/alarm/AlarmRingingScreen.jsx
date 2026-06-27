import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
<<<<<<< HEAD:frontend/src/screens/AlarmRingingScreen.jsx
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../components/common/Button';
import UniAlarm from '../assets/uni/uni-alarm';
=======
import Button from '../../components/common/Button';
>>>>>>> develop:frontend/src/screens/alarm/AlarmRingingScreen.jsx

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

const formatTime = (d) => {
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
};

const formatDate = (d) =>
    `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`

export default function AlarmRingingScreen({ onStartMission }) {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id);
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-Base-Background">
            <View className="flex-1 justify-between py-Space-spacing-3xl px-Space-spacing-xxl">
                <View className="items-center gap-Space-spacing-sm">
                    <Text className="text-Brand-Primary font-geologica-black text-display-extra-large text-center">
                        {formatTime(now)}
                    </Text>
                    <Text className="text-Uni-400 font-geologica-bold text-title-large text-center">
                        {formatDate(now)}
                    </Text>
                </View>

                <View className="items-center">
                    <UniAlarm width={200} height={200} />
                </View>

                <Button
                    title="Start Mission"
                    onPress={onStartMission}
                    variant="primary"
                    size="medium"
                    fullWidth
                />
            </View>
        </SafeAreaView>
    )
}