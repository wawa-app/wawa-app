import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/client';
import EyeIcon from '../components/EyeIcon';
import Button from '../components/common/Button';

export default function CreateNewPasswordScreen({ navigation, route }) {
    const { email, otp } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        try {
            setLoading(true);
            await apiClient.post('/api/auth/reset-password', { email, otp, newPassword });
            navigation.navigate('PasswordResetSuccess');
        } catch (err) {
            const code = err.response?.data?.error;
            if (code === 'INVALID_OR_EXPIRED_OTP') {
                Alert.alert('Error', 'Reset link has expired. Please request a new one.');
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
                    Create New Password
                </Text>

                {/* Subtitle */}
                <Text className="text-[14px] font-normal text-black text-center leading-[16.8px] mb-[23px]">
                    Enter a new password for your account
                </Text>

                {/* New Password label */}
                <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">New Password</Text>

                {/* New Password input */}
                <View className="w-[296px] h-12 flex-row items-center border border-[#ddd] rounded-lg px-4 mb-6">
                    <TextInput
                        className="flex-1 text-[14px] text-black"
                        placeholder="Create a new password"
                        placeholderTextColor="#B3B3B3"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNew}
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                        <EyeIcon color={showNew ? '#1a1a1a' : '#B3B3B3'} />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password label */}
                <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">Confirm Password</Text>

                {/* Confirm Password input */}
                <View className="w-[296px] h-12 flex-row items-center border border-[#ddd] rounded-lg px-4">
                    <TextInput
                        className="flex-1 text-[14px] text-black"
                        placeholder="Confirm new password"
                        placeholderTextColor="#B3B3B3"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirm}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                        <EyeIcon color={showConfirm ? '#1a1a1a' : '#B3B3B3'} />
                    </TouchableOpacity>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View className="w-[296px] pb-[73px]">
                {loading
                    ? <ActivityIndicator color="#000" className="mb-4" />
                    : <Button title="Reset Password" onPress={handleResetPassword} fullWidth />
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
