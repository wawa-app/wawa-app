import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

export default function LaunchScreen({ navigation }) {
    return (
        <View style={styles.container}>

        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
            <Text style={styles.logoX}>✕</Text>
        </View>

        {/* App name */}
        <Text style={styles.title}>WaWa</Text>

        {/* Description */}
        <Text style={styles.description}>
            WaWa is a challenge-based alarm app that helps users build a reliable
            morning routine through visual search missions, smart image recognition,
            habit tracking, and rewards.
        </Text>

        {/* Get Started button */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}
        >
            <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoPlaceholder: {
        width: 56,
        height: 56,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoX: {
        fontSize: 28,
        color: '#1a1a1a',
    },
    title: {
        fontSize: 48,
        fontWeight: '500',
        color: '#000',
        marginBottom: 20,
        alignItems: 'center',
        lineHeight: 48,
    },
    description: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        lineHeight: 14,
        marginBottom: 48,
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
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: -0.105,
    },
});