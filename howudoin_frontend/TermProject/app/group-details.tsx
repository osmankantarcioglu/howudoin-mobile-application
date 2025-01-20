import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function GroupDetailsScreen() {
    const { user, token } = useAuth();
    const { groupId, groupName, createdAt: initialCreatedAt } = useLocalSearchParams<{ 
        groupId: string; 
        groupName?: string; 
        createdAt?: string;
    }>();
    const router = useRouter();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [groupCreatedAt, setGroupCreatedAt] = useState(initialCreatedAt || '');

    useEffect(() => {
        const fetchGroupDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`http://10.51.88.151:8080/groups/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText || 'Failed to fetch group details.');
                }
    
                const groupData = await response.json();
                setMembers(groupData.members);
                setGroupCreatedAt(groupData.createdAt);
            } catch (err) {
                setError(err.message || 'Failed to load group details.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchGroupDetails();
    }, [groupId, token]);

    const handleAddMember = async () => {
        if (!newMemberEmail.trim()) return;
        setAdding(true);
        setError('');
        try {
            const payload = { userEmail: newMemberEmail.trim() };
            const response = await fetch(`http://10.51.88.151:8080/groups/${groupId}/add-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to add member.');
            }

            setNewMemberEmail('');
            // Refresh members after adding a member
            const refreshResp = await fetch(`http://10.51.88.151:8080/groups/${groupId}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedMembers = await refreshResp.json();
            setMembers(updatedMembers);

        } catch (err) {
            setError(err.message || 'Failed to add member.');
        } finally {
            setAdding(false);
        }
    };

    const openGroupChat = () => {
        router.push({ pathname: '/group-chat', params: { groupId } });
    };

    const creationString = groupCreatedAt || 'Unknown';

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading group details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.title}>{groupName ? groupName : `Group ID: ${groupId}`}</Text>
            <Text style={styles.creationInfo}>Created At: {creationString}</Text>

            <Text style={styles.subtitle}>Members:</Text>
            {members.length === 0 ? (
                <Text>No members found.</Text>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => <Text style={styles.memberText}>{item}</Text>}
                    style={{ marginBottom: 20 }}
                />
            )}

            <Text style={styles.subtitle}>Add Member</Text>
            <TextInput
                style={styles.input}
                placeholder="Member email"
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
            />
            <TouchableOpacity
                style={[styles.addButton, adding && styles.buttonDisabled]}
                onPress={handleAddMember}
                disabled={adding}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatButton} onPress={openGroupChat}>
                <Text style={styles.buttonText}>Open Group Chat</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    creationInfo: { fontSize: 16, color: '#333', marginBottom: 20 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    memberText: { fontSize: 16, marginVertical: 5 },
    input: { backgroundColor: '#f5f5f5', padding: 10, borderRadius: 10, fontSize: 16, marginBottom: 10 },
    addButton: { backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    chatButton: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#A8E4BE' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});