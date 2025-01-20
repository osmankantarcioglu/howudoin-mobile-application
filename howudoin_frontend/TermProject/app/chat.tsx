import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Message {
    id: string;
    senderEmail: string;
    receiverEmail: string;
    content: string;
    timestamp: string;
}

export default function ChatScreen() {
    const { user, token } = useAuth();
    const { friendEmail } = useLocalSearchParams<{ friendEmail: string }>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        if (!user?.email || !friendEmail) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                `http://10.51.88.151:8080/messages/messages?senderEmail=${user.email}&receiverEmail=${friendEmail}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to load messages.');
            }

            const data: Message[] = await response.json();
            // Reverse if you want latest messages at the bottom.
            // If you keep inverted={true} in FlatList, newest messages appear at top.
            setMessages(data.reverse());
        } catch (err: any) {
            setError(err.message || 'Failed to load messages.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMessages();
        }, [friendEmail, user?.email])
    );

    const sendMessage = async () => {
        if (!messageContent.trim() || !friendEmail || !user?.email) return;

        setSending(true);
        setError('');
        const payload = {
            senderEmail: user.email,
            receiverEmail: friendEmail,
            content: messageContent.trim(),
        };

        try {
            const response = await fetch('http://10.51.88.151:8080/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseBody = await response.text();
            if (!response.ok) {
                throw new Error(responseBody || 'Failed to send message.');
            }

            setMessageContent('');
            fetchMessages();
        } catch (err: any) {
            setError(err.message || 'Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.senderEmail === user?.email;
        return (
            <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat with {friendEmail}</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text>Loading conversation...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        style={styles.messagesList}
                        inverted={true} // newest messages at top
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={messageContent}
                            onChangeText={setMessageContent}
                            editable={!sending}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={sending}
                        >
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5ddd5',
    },
    header: {
        backgroundColor: '#075E54',
        padding: 15,
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    messagesList: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        color: '#999',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#25D366',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#A8E4BE',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
