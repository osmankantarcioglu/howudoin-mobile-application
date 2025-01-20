import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function GroupChatScreen() {
    const { user, token } = useAuth();
    const { groupId } = useLocalSearchParams<{ groupId: string }>();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [sending, setSending] = useState(false);
    const groupName = null; // If you have a group name, set it here.

    const fetchMessages = async () => {
        if (!groupId) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://10.51.88.151:8080/groups/${groupId}/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to load group messages.');
            }

            const data = await response.json();
            // Sort messages so oldest is at the top and newest at the bottom
            data.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            setMessages(data);
        } catch (err) {
            setError(err.message || 'Failed to load messages.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMessages();
        }, [groupId])
    );

    const sendMessage = async () => {
        if (!messageContent.trim() || !groupId) return;

        setSending(true);
        setError('');
        const payload = {
            senderEmail: user.email,
            content: messageContent.trim(),
        };

        try {
            const response = await fetch(`http://10.51.88.151:8080/groups/${groupId}/send`, {
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
            // After sending a message, refetch messages to update the list
            fetchMessages();
        } catch (err) {
            setError(err.message || 'Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isMine = item.senderEmail === user.email;
        return (
            <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
                {!isMine && <Text style={styles.senderInfo}>{item.senderEmail}</Text>}
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
                <Text style={styles.headerTitle}>
                    {groupName ? `Group Chat: ${groupName}` : `Group ID: ${groupId}`}
                </Text>
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
    senderInfo: {
        fontSize: 12,
        color: '#555',
        marginBottom: 5,
        fontWeight: 'bold',
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
