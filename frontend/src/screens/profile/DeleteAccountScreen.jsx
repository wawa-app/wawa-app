import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Warning } from '../../components/icons';
import AppBar from '../../components/common/AppBar';
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
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>
            <AppBar title="Delete Account" onBack={() => navigation.goBack()} />

            {/* gap: 208px */}
            <View style={{ height: 208 }} />

            {/* Warning icon in circle frame */}
            <View style={{ alignItems: 'center' }}>
                <View style={{
                    padding: 19,
                    borderRadius: 55,
                    borderWidth: 0.1,
                    borderColor: '#595858',
                    backgroundColor: '#FFE0B2',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Warning size={72} />
                </View>
            </View>

            {/* gap: 16px */}
            <View style={{ height: 16 }} />

            {/* Text container */}
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
                <Text style={{ height: 33, alignSelf: 'stretch', color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24 }}>
                    Delete Your Account
                </Text>
                <View style={{ width: 304, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24 }}>
                        This section cannot be undone. All your data will be automatically deleted.
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1 }} />

            {/* Buttons */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104, gap: 12 }}>
                {loading
                    ? <ActivityIndicator color="#FF6D00" />
                    : <Button title="Delete Account" onPress={handleDelete} fullWidth shape="square" />
                }
                <View style={{ alignItems: 'center', gap: 4 }}>
                    <Text style={{ textAlign: 'center', color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>
                        Want to keep your account?
                    </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                        <Text style={{ textAlign: 'center', color: '#2664F2', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, textDecorationLine: 'underline' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
