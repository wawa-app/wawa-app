import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Warning } from '../../components/icons';
import Button from '../../components/common/Button';
import apiClient from '../../api/client';

export default function DeleteAccountScreen({ navigation }) {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            'Are you sure?',
            'This cannot be undone. All your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await apiClient.delete('/api/users/account');
                            await logout();
                        } catch (err) {
                            Alert.alert('Error', err.response?.data?.message ?? 'Failed to delete account.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-Base-Background items-center justify-center px-6">
            {/* Warning circle */}
            <View className="w-32 h-32 rounded-full bg-Base-Paper items-center justify-center mb-6">
                <Warning size={72} />
            </View>

            {/* Text */}
            <Text className="text-[24px] font-bold text-Base-OnBackground text-center mb-4">
                Delete Your Account
            </Text>
            <Text className="text-[16px] font-geologica-regular text-Base-OnBackground text-center mb-16">
                This section cannot be undone. All your data will be automatically deleted.
            </Text>

            {/* Buttons */}
            <View className="w-full gap-3">
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : <Button title="Delete Account" onPress={handleDelete} fullWidth shape="round" />
                }
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <Text className="text-center text-[14px] font-geologica-regular text-Base-OnBackground">
                        Want to keep your account?{' '}
                        <Text className="text-Brand-Primary font-geologica-bold">Cancel</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
