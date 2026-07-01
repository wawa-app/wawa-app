import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppTextField from './AppTextField';

export default function TextFieldShowcase() {
  const [first, setFirst] = useState('Name');
  const [second, setSecond] = useState('Name');
  const [tagged, setTagged] = useState('Name');

  return (
    <ScrollView className="flex-1 bg-black px-5 py-8">
      <View className="gap-8">
        <AppTextField value={first} onChangeText={setFirst} showClearButton />
        <AppTextField value={second} onChangeText={setSecond} showClearButton />
        <AppTextField value="Name" onChangeText={() => {}} showErrorIcon />

        <AppTextField
          label="Name"
          required
          value="Name"
          onChangeText={() => {}}
          helperText="Supporting Text"
          showClearButton
          disabled
        />

        <AppTextField
          value={tagged}
          onChangeText={setTagged}
          leftIcon="Label"
          showClearButton
        />

        <AppTextField
          value="Name"
          onChangeText={() => {}}
          leftIcon="Label"
          showErrorIcon
        />

        <AppTextField value="Name" onChangeText={() => {}} />
        <AppTextField value="Name" onChangeText={() => {}} leftIcon="Label" />

        <AppTextField
          label="Name"
          required
          value="Name"
          onChangeText={() => {}}
          helperText="Supporting Text"
          leftIcon="Label"
          showClearButton
          disabled
        />
      </View>
    </ScrollView>
  );
}
