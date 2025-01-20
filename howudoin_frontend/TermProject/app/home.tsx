import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigateToUsers = () => {
        router.push('/users');
    };

    const navigateToFriendsList = () => {
        router.push('/friends-list');
    };

    const navigateToAcceptFriendRequest = () => {
        router.push('/accept-friend-request');
    };

    const navigateToGroups = () => {
        router.push('/groups');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>{user?.email}</Text>

            <TouchableOpacity style={styles.friendButton} onPress={navigateToUsers}>
                <Text style={styles.buttonText}>Find Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.friendsListButton} onPress={navigateToFriendsList}>
                <Text style={styles.buttonText}>Friends List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptRequestButton} onPress={navigateToAcceptFriendRequest}>
                <Text style={styles.buttonText}>Accept Friend Request</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.groupsButton} onPress={navigateToGroups}>
                <Text style={styles.buttonText}>Groups</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
    friendButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    friendsListButton: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    acceptRequestButton: { backgroundColor: '#FFA500', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    groupsButton: { backgroundColor: '#8A2BE2', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    logoutButton: { backgroundColor: '#ff4444', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 'auto' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
    