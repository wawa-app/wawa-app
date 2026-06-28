import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Back } from '../../components/icons';
import Button from '../../components/common/Button';
import apiClient from '../../api/client';

export default function ChangeUserNameScreen({ navigation }) {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username ?? '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Username cannot be empty.');
            return;
        }
        try {
            setLoading(true);
            const response = await apiClient.patch('/api/users/profile', { username: username.trim() });
            if (response.data?.success) {
                setUser(prev => ({ ...prev, username: username.trim() }));
                navigation.goBack();
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message ?? 'Failed to update username.');
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
                    Change User Name
                </Text>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-Neutral-Gray-300 mx-6 mb-6" />

            {/* Content */}
            <View className="flex-1 px-6">
                <Text className="text-[14px] font-geologica-regular text-Base-OnBackground mb-2">
                    User Name
                </Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor="#A29789"
                    className="w-full h-12 border border-Neutral-Gray-400 rounded-lg px-4 text-[14px] text-Base-OnBackground bg-Base-Surface"
                />
            </View>

            {/* Save button */}
            <View className="px-6 pb-[60px]">
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : <Button title="Save User Name" onPress={handleSave} fullWidth shape="round" />
                }
            </View>
        </View>
    );
}
