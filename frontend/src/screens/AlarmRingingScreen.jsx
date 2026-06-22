import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Button from '../components/common/Button';

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
        <View className="flex-1 bg-background justify-between py-20 px-6">
            <View className="items-center mt-16">
                <Text className="text-on-background text-8xl">{formatTime(now)}</Text>
                <Text className="text-on-surface text-xl tracking-widest mt-2">{formatDate(now)}</Text>
            </View>

            <Button
                title="Start mission"
                onPress={onStartMission}
                variant="primary"
                size="medium"
                fullWidth
            />
        </View>
    )
}