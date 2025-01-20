import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function FriendsListScreen() {
    const { user, token } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchFriends = async () => {
            if (!user?.email) {
                setError('User is not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://10.51.88.151:8080/friends?email=${user.email}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch friends.');
                }

                const data = await response.json();
                setFriends(data);
            } catch (err) {
                setError(err.message || 'Failed to load friends.');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [user, token]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading friends...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const openChat = (friendEmail) => {
        // Navigate to ChatScreen with the friendEmail as a parameter
        router.push({ pathname: '/chat', params: { friendEmail: friendEmail } });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Friends</Text>
            {friends.length === 0 ? (
                <Text style={styles.noFriendsText}>No friends found.</Text>
            ) : (
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.email}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.friendItem} onPress={() => openChat(item.email)}>
                            <Text style={styles.friendName}>{item.name}</Text>
                            <Text style={styles.friendEmail}>{item.email}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    noFriendsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    friendItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    friendName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    friendEmail: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});
