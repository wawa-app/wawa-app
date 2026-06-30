import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Check } from '../../components/icons';
import AppBar from '../../components/common/AppBar';
import Button from '../../components/common/Button';
import EyeIcon from '../../components/EyeIcon';
import apiClient from '../../api/client';

function PasswordInput({ placeholder, value, onChangeText }) {
    const [show, setShow] = useState(false);
    return (
        <View style={{ width: 292, height: 56, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#757575"
                secureTextEntry={!show}
                style={{ flex: 1, fontFamily: 'Geologica-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06, color: '#1A0F07' }}
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
            <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>
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
            const code = err.response?.data?.error;
            if (code === 'INVALID_CURRENT_PASSWORD') {
                Alert.alert('Error', 'Current password is incorrect.');
            } else {
                Alert.alert('Error', err.response?.data?.message ?? 'Failed to update password.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-Base-Background">
            <AppBar title="Change Password" onBack={() => navigation.goBack()} />

            {/* gap: 96px */}
            <View style={{ height: 96 }} />

            {/* Fields card */}
            <View style={{ width: 345, alignSelf: 'center', paddingHorizontal: 26, paddingVertical: 24, backgroundColor: '#FFE0B2', borderRadius: 10, gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                        Current Password
                    </Text>
                    <PasswordInput placeholder="Enter current password" value={current} onChangeText={setCurrent} />
                </View>
                <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'stretch' }} />
                <View>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                        New Password
                    </Text>
                    <PasswordInput placeholder="Enter new password" value={newPass} onChangeText={setNewPass} />
                </View>
                <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'stretch' }} />
                <View>
                    <Text style={{ alignSelf: 'stretch', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                        Confirm New Password
                    </Text>
                    <PasswordInput placeholder="Confirm new password" value={confirm} onChangeText={setConfirm} />
                </View>
                <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'stretch' }} />

                {/* Requirements */}
                <View style={{ width: 216, height: 79 }}>
                    <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Medium', fontSize: 14, lineHeight: 20 }}>
                        Password requirements:
                    </Text>
                    <Requirement met={hasLength} label="At least 5 characters" />
                    <Requirement met={hasNumberSymbol} label="Include a number & symbol" />
                </View>
            </View>

            <View className="flex-1" />

            {/* Save button */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : <Button title="Save" onPress={handleSave} fullWidth shape="square" />
                }
            </View>
        </View>
    );
}
