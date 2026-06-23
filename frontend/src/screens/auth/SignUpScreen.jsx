import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import EyeIcon from '../../components/EyeIcon';
import Button from '../../components/common/Button';

export default function SignUpScreen({ navigation }) {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
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
        <View className="flex-1 bg-white items-center">

            {/* Status bar */}
            <View className="h-6 self-stretch" />

            {/* Header zone */}
            <View className="h-16 self-stretch" />

            {/* Top spacer */}
            <View className="flex-1" />

            {/* Content frame: w-296px, items-center */}
            <View className="w-[296px]">

                {/* Title */}
                <Text className="text-[24px] font-bold text-black text-center leading-[28.8px] tracking-[-0.48px] mb-[15px]">
                    Create Account
                </Text>

                {/* Subtitle */}
                <Text className="text-[14px] font-normal text-black text-center leading-[16.8px] mb-10">
                    Sign up to secure your space
                </Text>

                {/* Email label */}
                <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">Email</Text>

                {/* Email input */}
                <View className="w-[296px] h-12 flex-row items-center border border-[#ddd] rounded-lg px-4 mb-6">
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

                {/* Password label */}
                <Text className="text-[15px] font-medium text-black leading-[15px] mb-1.5">Password</Text>

                {/* Password input */}
                <View className="w-[296px] h-12 flex-row items-center border border-[#ddd] rounded-lg px-4">
                    <TextInput
                        className="flex-1 text-[14px] text-black"
                        placeholder="Create password"
                        placeholderTextColor="#B3B3B3"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <EyeIcon color={showPassword ? '#1a1a1a' : '#B3B3B3'} />
                    </TouchableOpacity>
                </View>

            </View>

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button + footer pinned to bottom */}
            <View className="w-[296px] pb-[73px]">
                {loading
                    ? <ActivityIndicator color="#000" className="mb-4" />
                    : <Button title="Sign Up" onPress={handleSignUp} fullWidth />
                }
                <Text className="text-center text-[14px] font-normal text-black mt-4 leading-[27px]">
                    Already have an account?{' '}
                    <Text className="text-[#1C4BB6] font-medium" onPress={() => navigation.navigate('SignIn')}>
                        Sign in
                    </Text>
                </Text>
            </View>

        </View>
    );
}
