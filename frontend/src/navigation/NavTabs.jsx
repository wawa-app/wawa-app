import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    AlarmIcon,
    ObjectLists,
    Tracking,
    Profile,
} from '../components/icons';

import AlarmListScreen from '../screens/AlarmListScreen.jsx';
import ObjectsScreen from '../screens/ObjectsScreen.jsx';
import ChallengeScreen from '../screens/ChallengeScreen.jsx';
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
            className={`w-10 h-10 rounded-full items-center justify-center ${focused ? 'bg-white' : 'bg-transparent'
                }`}
        >
            <Icon size={22} color={focused ? '#1A0F07' : '#5B5363'} />
        </View>
    )
}

export default function NavTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#5B5363',
                tabBarInactiveTintColor: '#4D4A50',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Geologica-Medium',
                },
                tabBarStyle: {
                    height: 80,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#c9c9c9',
                    borderTopWidth: 0,
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
            <Tab.Screen name="Challenge" component={ChallengeScreen} />
            <Tab.Screen name="Tracking" component={TrackingScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}