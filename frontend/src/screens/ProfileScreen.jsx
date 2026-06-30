import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Logout, Edit } from '../components/icons';
import Svg, { Mask, Rect, G, Path } from 'react-native-svg';

const ChevronRight = () => (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
        <Mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="-1" width="25" height="26">
            <Rect x="23.9997" y="24.1253" width="24" height="24" transform="rotate(-179.7 23.9997 24.1253)" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0)">
            <Path d="M8.7949 18.1657L16.1158 12.2661C16.3625 12.0673 16.3645 11.6921 16.1199 11.4908L8.8611 5.51487" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
        </G>
    </Svg>
);

function SettingsRow({ label, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ height: 80, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}
        >
            <Text style={{ width: 205, height: 17, color: '#1A0F07', fontFamily: 'Geologica-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06 }}>
                {label}
            </Text>
            <ChevronRight />
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
            {/* gap: 24px */}
            <View style={{ height: 24 }} />

            {/* Account container */}
            <View style={{ width: 328, alignSelf: 'center' }}>
                {/* Title + Logout */}
                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text className="text-[32px] font-bold text-Base-OnBackground">
                        Account
                    </Text>
                    <TouchableOpacity
                        onPress={() => Alert.alert(
                            '',
                            'You will be signed out of your account',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Sign out', style: 'destructive', onPress: logout },
                            ]
                        )}
                        activeOpacity={0.7}
                    >
                        <Logout size={28} />
                    </TouchableOpacity>
                </View>

                {/* gap: 16px */}
                <View style={{ height: 16 }} />

                {/* Hello username */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChangeUserName')}
                    activeOpacity={0.7}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Text className="text-[16px] font-geologica-regular text-Base-OnBackground mr-2">
                        Hello {user?.username ?? 'User'}
                    </Text>
                    <Edit size={18} />
                </TouchableOpacity>
            </View>

            {/* gap: 24px */}
            <View style={{ height: 24 }} />

            {/* Settings card */}
            <View style={{ width: 327.5, alignSelf: 'center', paddingHorizontal: 8, borderRadius: 10, backgroundColor: '#FFE0B2', overflow: 'hidden' }}>
                <SettingsRow
                    label="Change and confirm password"
                    onPress={() => navigation.navigate('ChangePassword')}
                />
                <View style={{ width: 286.125, height: 0.7, backgroundColor: 'rgba(0, 0, 0, 0.15)', alignSelf: 'center' }} />
                <SettingsRow
                    label="Delete account"
                    onPress={() => navigation.navigate('DeleteAccount')}
                />
            </View>
        </ScrollView>
    );
}
