import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';

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
        <View style={{ flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center' }}>

            {/* Top spacer */}
            <View style={{ height: 232 }} />

            {/* Content frame */}
            <View style={{ width: 292, alignSelf: 'center' }}>

                {/* Title */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 32, lineHeight: 40, marginBottom: 16, alignSelf: 'stretch' }}>
                    Check Your Email
                </Text>

                {/* Subtitle */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24, marginBottom: 32, alignSelf: 'stretch' }}>
                    We sent 6-digit code to your email {email}
                </Text>

                {/* Received Code label + input */}
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14 }}>
                        Received Code
                    </Text>
                    <View style={{ alignSelf: 'stretch', height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 14, color: '#1A0F07', letterSpacing: 8 }}
                            placeholder="000000"
                            placeholderTextColor="#A29789"
                            value={otp}
                            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>
                </View>

            </View>

            {/* gap: 32px between input and buttons */}
            <View style={{ height: 32 }} />

            {/* Buttons + footer pinned to bottom */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" style={{ marginBottom: 8 }} />
                    : <Button title="Verify Code" onPress={handleVerify} fullWidth shape="square" />
                }
                <View style={{ marginTop: 8 }}>
                    {resending
                        ? <ActivityIndicator color="#FF6D00" />
                        : <Button title="Resend Code" onPress={handleResend} variant="secondary" fullWidth shape="square" />
                    }
                </View>
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
