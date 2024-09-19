import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Unidade {
  id: string;
  nomeUnidade: string;
  referenciaCurso: string; 
}

const UnidadeV = () => {
  const { id } = useLocalSearchParams(); 
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const router = useRouter();

  const fetchUnidades = async () => {
    if (id) {
      const cursoRef = doc(db, 'Curso', id);

      const unidadesQuery = query(
        collection(db, 'Unidade'),
        where('referenciaCurso', '==', cursoRef)
      );

      const querySnapshot = await getDocs(unidadesQuery);
      const unidadesList: Unidade[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Unidade));
      setUnidades(unidadesList);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, [id]);

  const renderUnidadeItem = ({ item }: { item: Unidade }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/licoes/licaoV?id=${item.id}`)}
    >
      <Text style={styles.unidadeNome}>{item.nomeUnidade}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {unidades.length > 0 ? (
        <FlatList
          data={unidades}
          keyExtractor={(item) => item.id}
          renderItem={renderUnidadeItem}
        />
      ) : (
        <Text>Nenhuma unidade encontrada para este curso.</Text>
      )}
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
  unidadeNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UnidadeV;
