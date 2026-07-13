import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import EyeIcon from '../../components/EyeIcon';
import Button from '../../components/common/Button';
import { Check } from '../../components/icons';

function Requirement({ met, label }) {
    return (
        <View className="flex-row items-center gap-2 mt-1">
            <Check size={12} color={met ? '#4CAF50' : '#1A0F07'} />
            <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>
                {label}
            </Text>
        </View>
    );
}

export default function SignUpScreen({ navigation }) {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const hasLength = password.length >= 5;
    const hasNumberSymbol = /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!hasLength || !hasNumberSymbol) {
            Alert.alert('Error', 'Password does not meet requirements.');
            return;
        }
        try {
            setLoading(true);
            await signup(email, password);
        } catch (err) {
            const code = err.response?.data?.error;
            if (code === 'EMAIL_ALREADY_EXISTS') {
                Alert.alert('Sign Up Failed', 'An account with this email already exists.');
            } else if (code === 'MISSING_FIELDS') {
                Alert.alert('Sign Up Failed', 'Please fill in all fields.');
            } else {
                Alert.alert('Sign Up Failed', 'Something went wrong. Please try again.');
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
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 32, lineHeight: 40, marginBottom: 16 }}>
                    Create Account
                </Text>

                {/* Subtitle */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24, marginBottom: 32, alignSelf: 'stretch' }}>
                    Sign up to secure your space
                </Text>

                {/* Email label + input */}
                <View style={{ width: 292, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center', marginBottom: 8 }}>
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

                {/* Password label + input */}
                <View style={{ width: 292, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14 }}>Password</Text>
                    <View style={{ alignSelf: 'stretch', height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                        <TextInput
                            style={{ flex: 1, fontSize: 14, color: '#1A0F07' }}
                            placeholder="Create password"
                            placeholderTextColor="#A29789"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <EyeIcon visible={showPassword} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: 216, alignSelf: 'center', marginTop: 24 }}>
                        <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Medium', fontSize: 14, lineHeight: 20 }}>
                            Password requirements:
                        </Text>
                        <Requirement met={hasLength} label="At least 5 characters" />
                        <Requirement met={hasNumberSymbol} label="Include a number & symbol" />
                    </View>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View style={{ width: 292, justifyContent: 'center', alignItems: 'center', paddingBottom: 104, alignSelf: 'center' }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" className="mb-4" />
                    : <Button title="Sign Up" onPress={handleSignUp} fullWidth shape="square" />
                }
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#1A0F07', marginTop: 8 }}>
                    Already have an account?{' '}
                    <Text style={{ color: '#FF6D00', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('SignIn')}>
                        Sign in
                    </Text>
                </Text>
            </View>

        </View>
    );
}
