import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';

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
        <View className="flex-1 bg-Base-Background items-center">

            {/* Top spacer */}
            <View style={{ height: 232 }} />

            {/* Content frame */}
            <View style={{ width: '100%', paddingHorizontal: 34 }}>

                {/* Title */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 32, lineHeight: 40, marginBottom: 16, alignSelf: 'stretch', justifyContent: 'center' }}>
                    Reset Password
                </Text>

                {/* Subtitle */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 32, width: 223, alignSelf: 'center' }}>
                    Enter your email and we will send you a link to reset your password
                </Text>

                {/* Email label + input */}
                <View style={{ width: 292, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14 }}>Email</Text>
                    <View style={{ alignSelf: 'stretch', height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 14, color: '#1A0F07' }}
                            placeholder="rodrigo878@wawa.ca"
                            placeholderTextColor="#A29789"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View style={{ width: 292, justifyContent: 'center', alignItems: 'center', paddingBottom: 104, alignSelf: 'center' }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" className="mb-4" />
                    : <Button title="Send Reset Link" onPress={handleSendResetLink} fullWidth shape="square" />
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
