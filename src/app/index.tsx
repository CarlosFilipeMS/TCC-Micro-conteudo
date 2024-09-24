import { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { router } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@admin.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Button title='Cursos' onPress={() => router.push('/cursos')} />
      <Button title='Cadastrar' onPress={() => router.push('/auth/cadastro')} />
      <Button title='Login' onPress={() => router.push('/auth/login')} />
      {isAdmin && (
        <Button title='Criar Tela' onPress={() => router.push('/criarLicao')} />
      )}
    </View>
  );
}
