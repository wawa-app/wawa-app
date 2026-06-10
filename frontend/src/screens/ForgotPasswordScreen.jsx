import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/client';
import Button from '../components/common/Button';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendResetLink = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        try {
            setLoading(true);
            await apiClient.post('/api/auth/forgot-password', { email });
            navigation.navigate('OtpVerification', { email });
        } catch (err) {
            const code = err.response?.data?.error;
            if (code === 'USER_NOT_FOUND') {
                Alert.alert('Error', 'No account found with this email.');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white items-center">

            {/* Status bar */}
            <View className="h-6 self-stretch" />

            {/* Header zone */}
            <View className="h-16 self-stretch" />

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content frame: w-296px */}
            <View className="w-[296px]">

                {/* Title */}
                <Text className="text-[24px] font-bold text-black text-center leading-[28.8px] tracking-[-0.48px] mb-[15px]">
                    Reset Password
                </Text>

                {/* Subtitle — w: 222.896px centered */}
                <Text className="w-[223px] text-[14px] font-normal text-black text-center leading-[16.8px] mb-[23px] self-center">
                    Enter your email and we will send you a link to reset your password
                </Text>

                {/* Email label */}
                <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">Email</Text>

                {/* Email input */}
                <View className="w-[296px] h-12 flex-row items-center border border-[#ddd] rounded-lg px-4">
                    <TextInput
                        className="flex-1 text-[14px] text-black"
                        placeholder="rodrigo878@wawa.ca"
                        placeholderTextColor="#B3B3B3"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View className="w-[296px] pb-[73px]">
                {loading
                    ? <ActivityIndicator color="#000" className="mb-4" />
                    : <Button title="Send Reset Link" onPress={handleSendResetLink} fullWidth />
                }
                <Text className="text-center text-[14px] font-normal text-black mt-4 leading-[27px]">
                    <Text className="text-[#1C4BB6] font-medium" onPress={() => navigation.navigate('SignIn')}>
                        Back to Sign In
                    </Text>
                </Text>
            </View>

        </View>
    );
}
