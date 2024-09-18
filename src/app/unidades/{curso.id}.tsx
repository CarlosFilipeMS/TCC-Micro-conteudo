import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

interface Unidade {
  id: string;
  nomeUnidade: string;
  referenciaCurso: string;
}

const UnidadesList = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const { cursoId } = useLocalSearchParams(); // Captura o cursoId da URL

  // Função para buscar as unidades do curso selecionado no Firebase
  const fetchUnidades = async () => {
    if (!cursoId) return; // Verificar se o cursoId está presente

    // Consultar as unidades onde referenciaCurso é igual ao cursoId
    const q = query(collection(db, 'Unidade'), where('referenciaCurso', '==', cursoId));
    const querySnapshot = await getDocs(q);
    const unidadesList: Unidade[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Unidade));
    setUnidades(unidadesList);
  };

  useEffect(() => {
    fetchUnidades();
  }, [cursoId]);

  const renderUnidadeCard = ({ item }: { item: Unidade }) => (
    <View style={styles.card}>
      <Text style={styles.unidadeNome}>{item.nomeUnidade}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id}
        renderItem={renderUnidadeCard}
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
  unidadeNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default UnidadesList;
