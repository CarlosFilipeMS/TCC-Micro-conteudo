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
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [noCursosMessage, setNoCursosMessage] = useState(false); // Estado para a mensagem de "nenhum curso"
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
    setIsLoading(false); // Define que o carregamento foi concluído
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

  useEffect(() => {
    // Espera 10 segundos para exibir a mensagem "Nenhum curso encontrado"
    const timer = setTimeout(() => {
      if (cursos.length === 0 && isLoading) {
        setNoCursosMessage(true);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timer); // Limpar o timer quando o componente for desmontado
  }, [cursos, isLoading]);

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
      <LogoutButton />
      <View style={styles.logoDiv}>
        <Image 
          source={require('../../assets/logo/logo.png')} 
          style={styles.logo} 
        />
      </View>
      {noCursosMessage ? (
        <Text style={styles.emptyMessage}>Nenhum curso encontrado.</Text>
      ) : (
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id}
          renderItem={renderCursoCard}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#a9efef',
  },
  logoDiv: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginTop: 60, 
    marginBottom: 20,
  },
  logo: {
    width: 450,
    height: 450,  
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Para sombra em dispositivos Android
    alignItems: 'center',
    width: '100%', 
    height: 140,
  },
  cursoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 8,
  },
  cursoResumo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default CursosList;
