import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LogoutButton from '../components/botaoLogout';

interface Curso {
  id: string;
  nomeCurso: string;
  resumo: string;
}

const CursosList = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const router = useRouter();
  const auth = getAuth();

  // Função para buscar cursos do Firestore
  const fetchCursos = async () => {
    const querySnapshot = await getDocs(collection(db, 'Curso'));
    const cursosList: Curso[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Curso));
    setCursos(cursosList);
  };

  useEffect(() => {
    // Verificar estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Se não houver usuário autenticado, redirecionar para a página de login
        router.push('/auth/login');
      } else {
        // Se houver usuário autenticado, buscar cursos
        fetchCursos();
      }
    });

    // Limpar inscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Renderizar os cards clicáveis e passar o ID do curso
  const renderCursoCard = ({ item }: { item: Curso }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/unidades/unidadeV?id=${item.id}`)}
    >
      <Text style={styles.cursoNome}>{item.nomeCurso}</Text>
      <Text style={styles.cursoResumo}>{item.resumo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LogoutButton/>
      <View style={styles.logoDiv}>
        <Image source={require('../../assets/logo/logo.png')} />
      </View>
      <View>
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id}
          renderItem={renderCursoCard}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#a9efef',
  },
  logoDiv:{
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#adec94',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
    height: 140
  },
  cursoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cursoResumo: {
    fontSize: 14,
    color: '#666',
  },
});

export default CursosList;
