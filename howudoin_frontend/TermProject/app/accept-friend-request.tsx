import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AcceptFriendRequestScreen() {
    const { user, token } = useAuth();
    const [fromEmail, setFromEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAcceptRequest = async () => {
        if (!fromEmail.trim()) {
            setStatusMessage('Please enter a valid email.');
            return;
        }
        if (!user?.email) {
            setStatusMessage('You must be logged in to accept a friend request.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        const payload = {
            fromEmail: fromEmail.trim(),
            toEmail: user.email,
        };

        try {
            const response = await fetch('http://10.51.88.151:8080/friends/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseBody = await response.text();
            if (!response.ok) {
                setStatusMessage(`Error: ${responseBody || 'Failed to accept friend request.'}`);
            } else {
                setStatusMessage('Friend request accepted successfully.');
                setFromEmail(''); // Clear the input after success
            }
        } catch (error) {
            setStatusMessage(`Error: ${error.message || 'Failed to accept friend request.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accept Friend Request</Text>

            <TextInput
                style={styles.input}
                placeholder="Sender's email"
                value={fromEmail}
                onChangeText={setFromEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAcceptRequest}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Accept</Text>
                )}
            </TouchableOpacity>

            {statusMessage !== '' && (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{statusMessage}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#25D366',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#A8E4BE',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});
