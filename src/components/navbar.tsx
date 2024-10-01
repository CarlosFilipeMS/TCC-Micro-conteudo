import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NavBar({ title }: { title: string }) {
  const router = useRouter();

  function handleBackPress() {
    router.back(); 
  }

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
