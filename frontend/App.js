import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import './global.css';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LaunchScreen from './src/screens/LaunchScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
    const { user, loading } = useAuth();

    // Show spinner while checking for existing token on launch
    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Launch" component={LaunchScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
    );
}

// Root component — wraps app with AuthContext and Navigation
export default function App() {
    return (
        <AuthProvider>
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
        </AuthProvider>
    );
}