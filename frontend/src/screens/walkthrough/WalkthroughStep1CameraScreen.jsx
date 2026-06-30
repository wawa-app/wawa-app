import React from 'react';
import { View, Text, PermissionsAndroid, Alert } from 'react-native';
import Stepper from '../../components/common/Stepper';
import Button from '../../components/common/Button';

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Allow WaWa to take picture and record video',
                message: '',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn('[CameraPermission]', err);
        return false;
    }
};

export default function WalkthroughStep1CameraScreen({ navigation }) {

    const handleGoToSetting = async () => {
        const granted = await requestCameraPermission();
        if (granted) {
            navigation.navigate('WalkthroughStep2');
        } else {
            Alert.alert(
                'Camera Permission Required',
                'Please allow camera access to continue.',
            );
        }
    };

    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Stepper */}
            <Stepper currentStep={1} />

            {/* gap: 17px */}
            <View className="h-[17px]" />

            {/* Content frame */}
            <View className="px-8">

                {/* Title */}
                <Text className="text-[24px] font-bold text-black text-center leading-[24px]">
                    Let's prepare for mission
                </Text>

                {/* gap: 9px */}
                <View className="h-[9px]" />

                {/* Subtitle */}
                <Text className="text-[14px] font-normal text-black text-center leading-[14px]">
                    Take 10 photos of your objects
                </Text>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button pinned to bottom */}
            <View className="w-[296px] self-center pb-[101px]">
                <Button
                    title="Open Camera"
                    onPress={handleGoToSetting}
                    fullWidth
                />
            </View>

        </View>
    );
}
