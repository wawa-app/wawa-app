import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import { useAuth } from '../context/AuthContext';
import EyeIcon from '../components/EyeIcon';

export default function SignInScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
        }
        try {
        setLoading(true);
        await login(email, password);
        } catch (err) {
        Alert.alert('Sign In Failed', 'Invalid email or password');
        } finally {
        setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

        {/* Header */}
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="info@wawa.ca"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputRow}>
            <TextInput
            style={styles.inputFlex}
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon color={showPassword ? '#1a1a1a' : '#B3B3B3'} />
            </TouchableOpacity>
        </View>

        {/* Sign In button */}
        <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
        >
            {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Sign in</Text>
            }
        </TouchableOpacity>

        {/* Footer links */}
        <Text style={styles.footerText}>
            <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
            Forgot Password?
            </Text>
        </Text>
        <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
            Sign up
            </Text>
        </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
        lineHeight: 48,
    },
    subtitle: {
        fontSize: 14,
        color: '#000',
        marginBottom: 32,
        lineHeight: 21,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 14,
        marginBottom: 20,
        color: '#000',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 28,
    },
    inputFlex: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 16,
        height: 64,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        alignSelf: 'stretch',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: -0.105,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
        lineHeight: 27.02,
    },
    link: {
        color: '#1C4BB6',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 27.02,
    },
});