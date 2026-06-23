import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const { logout } = useAuth();

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold">Profile</Text>

            <TouchableOpacity
                onPress={logout}
                activeOpacity={0.8}
                className="mt-8 bg-black rounded-2xl h-12 px-8 items-center justify-center"
            >
                <Text className="text-white text-[14px] font-geologica-bold font-bold">
                    Sign Out
                </Text>
            </TouchableOpacity>
        </View>
    );
}
