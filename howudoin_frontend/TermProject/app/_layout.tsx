//Dokuman degistirildi
import { Stack } from "expo-router";
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen 
                    name="index" 
                    options={{ 
                        title: "Login",
                        headerShown: true
                    }} 
                />
                <Stack.Screen 
                    name="register" 
                    options={{ 
                        title: "Register",
                        headerShown: true
                    }} 
                />
                <Stack.Screen 
                    name="home" 
                    options={{ 
                        title: "Home",
                        headerShown: true,
                        headerBackVisible: false
                    }} 
                />
                <Stack.Screen 
                    name="users" 
                    options={{ 
                        title: "Find Friends",
                        headerShown: true
                    }} 
                />
            </Stack>
        </AuthProvider>
    );
}