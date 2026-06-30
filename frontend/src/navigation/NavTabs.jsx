import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    AlarmIcon,
    ObjectLists,
    Tracking,
    Profile,
} from '../components/icons';

import AlarmListScreen from '../screens/alarm/AlarmListScreen.jsx';
import ObjectsScreen from '../screens/ObjectsScreen.jsx';
import TrackingScreen from '../screens/TrackingScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Alarm: AlarmIcon,
    Objects: ObjectLists,
    Tracking: Tracking,
    Profile: Profile,
}

function TabIcon({ Icon, focused }) {
    return (
        <View
            className={`px-5 py-2 rounded-3xl items-center justify-center ${focused ? 'bg-Sunlight-700' : 'bg-transparent'
                }`}
        >
            <Icon size={24} color="#1A0F07" />
        </View>
    )
}

export default function NavTabs() {
    const insets = useSafeAreaInsets()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#E67A00',
                tabBarInactiveTintColor: '#4D4A50',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Geologica-Medium',
                    lineHeight: 16,
                    letterSpacing: 0.06,
                    marginTop: 4,
                },
                tabBarStyle: {
                    height: 90 + insets.bottom,
                    paddingTop: 16,
                    paddingBottom: 8 + insets.bottom,
                    backgroundColor: '#FFF8E1',
                    borderTopWidth: 1,
                    borderTopColor: '#FF6D00',
                },
                tabBarIcon: ({ focused }) => {
                    const Icon = TAB_ICONS[route.name];
                    if (!Icon) return null;
                    return <TabIcon Icon={Icon} focused={focused} />;
                },
            })}
        >
            <Tab.Screen name="Alarm" component={AlarmListScreen} />
            <Tab.Screen name="Objects" component={ObjectsScreen} />
            <Tab.Screen name="Tracking" component={TrackingScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}