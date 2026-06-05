import './global.css';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import apiClient from './src/api/client';
import Button from './src/components/common/Button'

export default function App() {
    const [serverStatus, setServerStatus] = useState('Connecting to WaWa Backend...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/')
            .then((response) => {
                setServerStatus(response.data);
            })
            .catch((error) => {
                setServerStatus('Backend Connection Failed');
                setLoading(false);
                console.error('Connection Error:', error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WaWa App Initial Setup</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Text style={[styles.status, serverStatus.includes('❌') ? styles.error : styles.success]}>
                    {serverStatus}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    status: { fontSize: 16, fontWeight: '600', padding: 10, borderRadius: 5 },
    success: { color: '#2e7d32', backgroundColor: '#e8f5e9' },
    error: { color: '#c62828', backgroundColor: '#ffebee' }
});