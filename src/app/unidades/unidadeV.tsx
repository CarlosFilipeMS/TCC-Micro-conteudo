import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderBar from '../../components/headerBar';

interface Unidade {
  id: string;
  nomeUnidade: string;
  referenciaCurso: string;
  progresso: number; 
}

const UnidadeV = () => {
  const { id } = useLocalSearchParams(); 
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controle de carregamento
  const [noUnidadesMessage, setNoUnidadesMessage] = useState(false); // Estado para a mensagem de "nenhuma unidade"
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
      setIsLoading(false); // Carregamento concluído
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, [id]);

  useEffect(() => {
    // Espera 10 segundos para exibir a mensagem "Nenhuma unidade encontrada"
    const timer = setTimeout(() => {
      if (unidades.length === 0 && isLoading) {
        setNoUnidadesMessage(true);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timer); // Limpar o timer quando o componente for desmontado
  }, [unidades, isLoading]);

  const renderUnidadeItem = ({ item }: { item: Unidade }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/licoes/licaoV?id=${item.id}&cursoId=${id}`)}
    >
      <Text style={styles.unidadeNome}>{item.nomeUnidade}</Text>

      {item.progresso !== undefined && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressoText}>Progresso: {Math.round(item.progresso)}%</Text>
          <ProgressBar 
            progress={item.progresso / 100}
            color="#4caf50"
            style={styles.progressBar}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderBar title='Unidades' backTo='/' />
      {noUnidadesMessage ? (
        <Text style={styles.emptyMessage}>Nenhuma unidade encontrada para este curso.</Text>
      ) : (
        <FlatList
          data={unidades}
          keyExtractor={(item) => item.id}
          renderItem={renderUnidadeItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    elevation: 3
  },
  unidadeNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 3, 
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default UnidadeV;
