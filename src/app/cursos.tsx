import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

interface Curso {
  id: string;
  nomeCurso: string;
  resumo: string;
}

const CursosList = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const router = useRouter();

  // Buscando do firebase
  const fetchCursos = async () => {
    const querySnapshot = await getDocs(collection(db, 'Curso'));
    const cursosList: Curso[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Curso));
    setCursos(cursosList);
  };

  useEffect(() => {
    fetchCursos();
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
      <FlatList
        data={cursos}
        keyExtractor={(item) => item.id}
        renderItem={renderCursoCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
