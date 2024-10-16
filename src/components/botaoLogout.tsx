// LogoutButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para ícones
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth'; // Firebase para logout

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();

  // Função para logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout do Firebase
      router.push('/auth/login'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={26} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 3,
  },
});

export default LogoutButton;
