import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

interface Licao {
  id: string;
  conteudo: string;
  unidade: string;
  imagem: string;
}

const LicaoV = () => {
  const { id } = useLocalSearchParams();
  const [licoes, setLicoes] = useState<Licao[]>([]);

  const fetchLicoes = async () => {
    if (id) {
      const unidadeRef = doc(db, 'Unidade', id);

      const licoesQuery = query(
        collection(db, 'Licao'),
        where('unidade', '==', unidadeRef)
      );

      const querySnapshot = await getDocs(licoesQuery);
      const licoesList: Licao[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Licao));
      setLicoes(licoesList);
    }
  };

  useEffect(() => {
    fetchLicoes();
  }, [id]);

  const renderLicaoItem = ({ item }: { item: Licao }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.imagem }} 
        style={styles.image}
        />
      <Text style={styles.licaoTitulo}>{item.conteudo}</Text>

    </View>
  );

  return (
    <View style={styles.container}>
      {licoes.length > 0 ? (
        <FlatList
          data={licoes}
          keyExtractor={(item) => item.id}
          renderItem={renderLicaoItem}
        />
      ) : (
        <Text>Nenhuma lição encontrada para esta unidade.</Text>
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
  licaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  licaoDescricao: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default LicaoV;
