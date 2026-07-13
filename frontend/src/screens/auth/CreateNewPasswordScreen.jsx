import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../api/client';
import EyeIcon from '../../components/EyeIcon';
import Button from '../../components/common/Button';

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
        <View className="flex-1 bg-Base-Background items-center">

            {/* Top spacer */}
            <View style={{ height: 232 }} />

            {/* Content frame */}
            <View style={{ width: '100%', paddingHorizontal: 34 }}>

                {/* Title */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 32, lineHeight: 40, marginBottom: 16, alignSelf: 'stretch' }}>
                    Set New Password
                </Text>

                {/* Subtitle */}
                <Text style={{ width: 222.896, color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 32, alignSelf: 'center' }}>
                    Enter a new password for your account
                </Text>

                {/* New Password label + input */}
                <View style={{ width: 292, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>Create New Password</Text>
                    <View style={{ alignSelf: 'stretch', height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 14, color: '#1A0F07' }}
                            placeholder="Create password"
                            placeholderTextColor="#A29789"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNew}
                        />
                        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                            <EyeIcon visible={showNew} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* gap: 24px */}
                <View style={{ height: 24 }} />

                {/* Confirm Password label + input */}
                <View style={{ width: 292, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>Confirm New Password</Text>
                    <View style={{ alignSelf: 'stretch', height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 14, color: '#1A0F07' }}
                            placeholder="Create password"
                            placeholderTextColor="#A29789"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirm}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <EyeIcon visible={showConfirm} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View style={{ width: 292, justifyContent: 'center', alignItems: 'center', paddingBottom: 104, alignSelf: 'center' }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" style={{ marginBottom: 8 }} />
                    : <Button title="Reset Password" onPress={handleResetPassword} fullWidth shape="square" />
                }
                <Text style={{ textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, color: '#1A0F07', marginTop: 8 }}>
                    Back to{' '}
                    <Text style={{ color: '#2664F2', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('SignIn')}>
                        Sign In
                    </Text>
                </Text>
            </View>

        </View>
    );
}
