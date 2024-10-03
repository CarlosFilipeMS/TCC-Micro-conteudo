// HeaderBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para ícones
import { useRouter } from 'expo-router';

interface HeaderBarProps {
  title: string;
  backTo?: string; // Rota opcional para voltar
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, backTo }) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (backTo) {
      router.push(backTo); // Especificar rota para voltar
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6ddbd7',
    height: 60,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 3,
    marginRight: '5%',
  },
  title: {
    flex: 1,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HeaderBar;
