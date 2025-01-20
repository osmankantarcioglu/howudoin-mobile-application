import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SendFriendRequestScreen() {
    const { user, token } = useAuth();
    const [receiverEmail, setReceiverEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendRequest = async () => {
        // Validate input
        if (!receiverEmail.trim()) {
            setStatusMessage('Please enter a valid email.');
            return;
        }
        if (!user?.email) {
            setStatusMessage('You must be logged in to send a friend request.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        const payload = {
            fromEmail: user.email,
            toEmail: receiverEmail.trim(),
        };

        try {
            const response = await fetch('http://10.51.88.151:8080/friends/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseBody = await response.text();
            if (!response.ok) {
                setStatusMessage(`Error: ${responseBody || 'Failed to send friend request.'}`);
            } else {
                setStatusMessage('Friend request sent successfully.');
                setReceiverEmail(''); // Clear the input after successful send
            }
        } catch (error) {
            setStatusMessage(`Error: ${error.message || 'Failed to send friend request.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Send Friend Request</Text>

            <TextInput
                style={styles.input}
                placeholder="Receiver's email"
                value={receiverEmail}
                onChangeText={setReceiverEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendRequest}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Send</Text>
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
