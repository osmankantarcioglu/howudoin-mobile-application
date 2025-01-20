import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function GroupsScreen() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user?.email) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                // Assuming an endpoint: /groups?email={userEmail} to fetch user's groups
                const response = await fetch(`http://10.51.88.151:8080/groups?email=${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch groups.');
                }

                const data = await response.json();
                setGroups(data);
            } catch (err) {
                setError(err.message || 'Failed to load groups.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user, token]);

    const navigateToCreateGroup = () => {
        router.push('/create-group');
    };

    const openGroupDetails = (groupId) => {
        router.push({ pathname: '/group-details', params: { groupId } });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading Groups...</Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Groups</Text>
            <TouchableOpacity style={styles.createButton} onPress={navigateToCreateGroup}>
                <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>

            {groups.length === 0 ? (
                <Text style={styles.noItemsText}>No groups found.</Text>
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => openGroupDetails(item.id)}>
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    createButton: { backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    noItemsText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20 },
    item: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 10 },
    itemText: { fontSize: 18, fontWeight: 'bold' },
    errorText: { color: 'red', textAlign: 'center' },
});
