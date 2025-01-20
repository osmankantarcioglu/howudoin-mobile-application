import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function CreateGroupScreen() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [groupName, setGroupName] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            // reuse the endpoint for friends you have implemented previously:
            const response = await fetch(`http://10.51.88.151:8080/friends?email=${user.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) {
                const errText = await response.text();
                setError(errText || 'Failed to fetch friends');
                setLoading(false);
                return;
            }
            const data = await response.json();
            setFriends(data);
            setLoading(false);
        };

        fetchFriends();
    }, [user, token]);

    const toggleFriendSelection = (email) => {
        if (selectedFriends.includes(email)) {
            setSelectedFriends(selectedFriends.filter(f => f !== email));
        } else {
            setSelectedFriends([...selectedFriends, email]);
        }
    };

    const createGroup = async () => {
        if (!groupName.trim() || selectedFriends.length === 0) {
            setError('Please provide a name and select at least one friend.');
            return;
        }
        setCreating(true);
        setError('');
        const payload = {
            name: groupName.trim(),
            members: [user.email, ...selectedFriends]
        };

        try {
            const response = await fetch('http://10.51.88.151:8080/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to create group.');
            }
            await response.json();
            router.replace('/groups');
        } catch (err) {
            setError(err.message || 'Failed to create group.');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading friends...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Group</Text>
            <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.subtitle}>Select Friends</Text>
            <FlatList
                data={friends}
                keyExtractor={item => item.email}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.friendItem, selectedFriends.includes(item.email) && styles.friendItemSelected]}
                        onPress={() => toggleFriendSelection(item.email)}
                    >
                        <Text style={styles.friendText}>{item.name} ({item.email})</Text>
                    </TouchableOpacity>
                )}
                style={{ marginBottom: 20 }}
            />

            <TouchableOpacity
                style={[styles.createButton, creating && styles.buttonDisabled]}
                onPress={createGroup}
                disabled={creating}
            >
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    friendItem: { padding: 10, borderRadius: 5, backgroundColor: '#eee', marginVertical: 5 },
    friendItemSelected: { backgroundColor: '#cce5ff' },
    friendText: { fontSize: 16 },
    createButton: { backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    buttonDisabled: { backgroundColor: '#A8E4BE' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});
