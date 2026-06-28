import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Back, Check } from '../../components/icons';
import Button from '../../components/common/Button';
import EyeIcon from '../../components/EyeIcon';
import apiClient from '../../api/client';

function PasswordInput({ placeholder, value, onChangeText }) {
    const [show, setShow] = useState(false);
    return (
        <View className="w-full h-12 flex-row items-center border border-Neutral-Gray-400 rounded-lg px-4 bg-Base-Surface">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#A29789"
                secureTextEntry={!show}
                className="flex-1 text-[14px] text-Base-OnBackground"
            />
            <TouchableOpacity onPress={() => setShow(s => !s)}>
                <EyeIcon color={show ? '#1A0F07' : '#A29789'} />
            </TouchableOpacity>
        </View>
    );
}

function Requirement({ met, label }) {
    return (
        <View className="flex-row items-center gap-2 mt-1">
            <Check size={14} color={met ? '#4CAF50' : '#A29789'} />
            <Text className={`text-[12px] font-geologica-regular ${met ? 'text-State-Success' : 'text-Neutral-Gray-500'}`}>
                {label}
            </Text>
        </View>
    );
}

export default function ChangePasswordScreen({ navigation }) {
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const hasLength = newPass.length >= 5;
    const hasNumberSymbol = /[0-9]/.test(newPass) && /[^a-zA-Z0-9]/.test(newPass);

    const handleSave = async () => {
        if (!current || !newPass || !confirm) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (newPass !== confirm) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        if (!hasLength || !hasNumberSymbol) {
            Alert.alert('Error', 'Password does not meet requirements.');
            return;
        }
        try {
            setLoading(true);
            await apiClient.patch('/api/users/account', { currentPassword: current, newPassword: newPass });
            navigation.replace('PasswordUpdated');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message ?? 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-Base-Background">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-14 pb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} className="mr-3">
                    <Back size={24} />
                </TouchableOpacity>
                <Text className="text-[20px] font-bold text-Base-OnBackground">
                    Change Password
                </Text>
            </View>

            <View className="h-[1px] bg-Neutral-Gray-300 mx-6 mb-6" />

            {/* Fields card */}
            <View className="mx-6 bg-Base-Paper rounded-2xl p-4 gap-4">
                <View>
                    <Text className="text-[14px] font-geologica-regular text-Base-OnBackground mb-2">Current Password</Text>
                    <PasswordInput placeholder="Enter current password" value={current} onChangeText={setCurrent} />
                </View>
                <View>
                    <Text className="text-[14px] font-geologica-regular text-Base-OnBackground mb-2">New Password</Text>
                    <PasswordInput placeholder="Enter new password" value={newPass} onChangeText={setNewPass} />
                </View>
                <View>
                    <Text className="text-[14px] font-geologica-regular text-Base-OnBackground mb-2">Confirm New Password</Text>
                    <PasswordInput placeholder="Confirm new password" value={confirm} onChangeText={setConfirm} />
                </View>
                <View>
                    <Text className="text-[12px] font-bold text-Base-OnBackground">Password requirements:</Text>
                    <Requirement met={hasLength} label="At least 5 characters" />
                    <Requirement met={hasNumberSymbol} label="Include a number & symbol" />
                </View>
            </View>

            <View className="flex-1" />

            <View className="px-6 pb-[60px]">
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : <Button title="Save" onPress={handleSave} fullWidth shape="round" />
                }
            </View>
        </View>
    );
}
