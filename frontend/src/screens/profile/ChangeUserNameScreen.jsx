import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import AppBar from '../../components/common/AppBar';
import Button from '../../components/common/Button';
import apiClient from '../../api/client';

export default function ChangeUserNameScreen({ navigation }) {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username ?? '');
    const MAX_USERNAME_LENGTH = 20;
    const trimmed = username.trim();
    const isChanged = trimmed !== (user?.username ?? '');
    const isEmpty = trimmed.length === 0;
    const canSave = isChanged && !isEmpty;
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
            <AppBar title="Change User Name" onBack={() => navigation.goBack()} />

            {/* gap: 96px */}
            <View style={{ height: 96 }} />

            {/* Content */}
            <View style={{ width: 292, alignSelf: 'center' }}>
                <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                    User Name
                </Text>
                <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C4B8AE', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFF3CD' }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 14, color: '#1A0F07' }}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter username"
                        placeholderTextColor="#A29789"
                        maxLength={MAX_USERNAME_LENGTH}
                    />
                </View>
            </View>

            <View className="flex-1" />

            {/* Save button */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : (
                        <Button
                            title="Save User Name"
                            onPress={handleSave}
                            fullWidth
                            shape="square"
                            disabled={!canSave}
                        />
                    )
                }
            </View>
        </View>
    );
}
