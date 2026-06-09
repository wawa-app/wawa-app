import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/client';
import Button from '../components/common/Button';

export default function OtpVerificationScreen({ navigation, route }) {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter the 6-digit code');
            return;
        }
        try {
            setLoading(true);
            await apiClient.post('/api/auth/verify-otp', { email, otp });
            navigation.navigate('CreateNewPassword', { email, otp });
        } catch (err) {
            const code = err.response?.data?.error;
            if (code === 'INVALID_OR_EXPIRED_OTP') {
                Alert.alert('Error', 'Invalid or expired code. Please try again.');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            await apiClient.post('/api/auth/forgot-password', { email });
            Alert.alert('Code Sent', 'A new code has been sent to your email.');
        } catch {
            Alert.alert('Error', 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content frame: w-296px, gap-23px, items-center */}
            <View className="w-[296px] self-center items-center">

                {/* Title */}
                <Text className="text-[24px] font-bold text-black text-center leading-[28.8px] tracking-[-0.48px] mb-[15px]">
                    Check Your Email
                </Text>

                {/* Subtitle — w: 222.896px */}
                <Text className="w-[222.896px] text-[14px] font-normal text-black text-center leading-[16.8px] mb-[23px]">
                    We sent 6-digit code to your email {email}
                </Text>

                {/* Received Code label + input */}
                <View className="self-stretch">
                    <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">
                        Received Code
                    </Text>
                    <View className="h-12 flex-row items-center self-stretch border border-[#ddd] rounded-lg px-4">
                        <TextInput
                            className="flex-1 text-[14px] text-black tracking-[8px]"
                            placeholder="000000"
                            placeholderTextColor="#B3B3B3"
                            value={otp}
                            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Buttons + footer pinned to bottom */}
            <View className="px-8 pb-[101px]">
                {loading
                    ? <ActivityIndicator color="#000" className="mb-3" />
                    : <Button title="Verify Code" onPress={handleVerify} fullWidth />
                }
                <View className="mt-3">
                    {resending
                        ? <ActivityIndicator color="#000" />
                        : <Button title="Resend Code" onPress={handleResend} variant="secondary" fullWidth />
                    }
                </View>
                <Text className="text-center text-[14px] font-normal text-black mt-4 leading-[27px]">
                    <Text className="text-[#1C4BB6] font-medium" onPress={() => navigation.navigate('SignIn')}>
                        Back to Sign In
                    </Text>
                </Text>
            </View>

        </View>
    );
}
