import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AlarmListScreen from '../screens/AlarmListScreen.jsx';
import ObjectsScreen from '../screens/ObjectsScreen.jsx';
import ChallengeScreen from '../screens/ChallengeScreen.jsx';
import TrackingScreen from '../screens/TrackingScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';

const Tab = createBottomTabNavigator();

function TabIcon({ focused }) {
    return (
        <View
            className={`w-10 h-10 rounded-full items-center justify-center ${focused ? 'bg-white' : 'bg-transparent'
                }`}
        >
            <Text className="text-2xl text-neutral-700">★</Text>
        </View>
    )
}

export default function NavTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
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
            }}
        >
            <Tab.Screen
                name="Alarm"
                component={AlarmListScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
                }}
            />

            <Tab.Screen
                name="Objects"
                component={ObjectsScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
                }}
            />

            <Tab.Screen
                name="Challenge"
                component={ChallengeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
                }}
            />

            <Tab.Screen
                name="Tracking"
                component={TrackingScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
                }}
            />
        </Tab.Navigator>
    )
}