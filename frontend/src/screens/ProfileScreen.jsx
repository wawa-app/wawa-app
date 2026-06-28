import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { Logout, Edit } from '../components/icons';

function SettingsRow({ label, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-4 px-4"
        >
            <Text className="text-[16px] font-geologica-regular text-Base-OnBackground">
                {label}
            </Text>
            <Text className="text-[18px] text-Base-OnBackground">›</Text>
        </TouchableOpacity>
    );
}

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();

    return (
        <ScrollView
            className="flex-1 bg-Base-Background"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Logo */}
            <View className="items-center pt-10 pb-6">
                <Logo width={80} height={31} />
            </View>

            <View className="h-[1px] bg-Neutral-Gray-300 mx-6" />

            {/* Title + Logout */}
            <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
                <Text className="text-[32px] font-bold text-Base-OnBackground">
                    Account
                </Text>
                <TouchableOpacity onPress={logout} activeOpacity={0.7}>
                    <Logout size={28} />
                </TouchableOpacity>
            </View>

            {/* Hello username + edit */}
            <TouchableOpacity
                onPress={() => navigation.navigate('ChangeUserName')}
                activeOpacity={0.7}
                className="flex-row items-center px-6 pb-6"
            >
                <Text className="text-[16px] font-geologica-regular text-Base-OnBackground mr-2">
                    Hello {user?.username ?? 'User'}
                </Text>
                <Edit size={18} />
            </TouchableOpacity>

            {/* Settings card */}
            <View className="mx-6 bg-Base-Paper rounded-2xl overflow-hidden">
                <SettingsRow
                    label="Change and confirm password"
                    onPress={() => navigation.navigate('ChangePassword')}
                />
                <View className="h-[1px] bg-Neutral-Gray-300 mx-4" />
                <SettingsRow
                    label="Delete account"
                    onPress={() => navigation.navigate('DeleteAccount')}
                />
            </View>
        </ScrollView>
    );
}
