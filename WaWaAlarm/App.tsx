import React, { useState } from 'react';
import { View, Text, Button, NativeModules } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const { AlarmModule } = NativeModules;

export default function App() {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const setAlarm = () => {
    const alarm = new Date();
    alarm.setHours(time.getHours());
    alarm.setMinutes(time.getMinutes());
    alarm.setSeconds(0);
    AlarmModule.setAlarm(alarm.getTime());
    setShow(false);
  };

  const stopAlarm = () => {
    AlarmModule.stopAlarm();
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Text>Alarm POC</Text>

      <Button title="Pick Time" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          onChange={(event, selected) => {
            if (selected) setTime(selected);
          }}
        />
      )}

      <Text>Set Time: {time.getHours()}:{String(time.getMinutes()).padStart(2, '0')}</Text>

      <Button title="Set Alarm" onPress={setAlarm} />
      <Button title="Stop" onPress={stopAlarm} />
    </View>
  );
}