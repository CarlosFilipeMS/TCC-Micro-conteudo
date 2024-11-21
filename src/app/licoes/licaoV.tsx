import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, getDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderBar from '../../components/headerBar';
import CustomButton from '../../components/botao';

interface Licao {
    id: string;
    titulo: string;
    conteudo: string;
    unidade: string;
    imagemUrl?: string; // Alterado para imagemUrl
}

const LicaoV = () => {
    const { id, cursoId } = useLocalSearchParams();
    const [licoes, setLicoes] = useState<Licao[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Carregamento da lista de lições
    const [isContentLoading, setIsContentLoading] = useState(true); // Carregamento do conteúdo da lição
    const router = useRouter();

    // Fetch das lições de uma unidade
    const fetchLicoes = async () => {
        if (id) {
            try {
                const unidadeRef = doc(db, 'Unidade', id as string);

                const licoesQuery = query(
                    collection(db, 'Licao'),
                    where('unidade', '==', unidadeRef),
                    orderBy('ordem')
                );

                const querySnapshot = await getDocs(licoesQuery);
                const licoesList: Licao[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Licao));

                setLicoes(licoesList);
                setIsLoading(false); // Termina o carregamento da lista de lições
            } catch (error) {
                console.error('Erro ao buscar lições: ', error);
                setIsLoading(false); // Em caso de erro, termina o carregamento
            }
        }
    };

    useEffect(() => {
        fetchLicoes();
    }, [id]);

    useEffect(() => {
        // Simular um atraso de 1-2 segundos antes de mostrar o conteúdo
        const timer = setTimeout(() => {
            setIsContentLoading(false); // Define o conteúdo como carregado após o atraso
        }, 1500); // Atraso de 1.5 segundos

        return () => clearTimeout(timer); // Limpa o timer quando o componente for desmontado
    }, [licoes]);

    // Calcular o progresso
    const calcularProgresso = () => {
        if (licoes.length > 0) {
            return ((currentIndex + 1) / licoes.length) * 100; // Progresso em porcentagem
        }
        return 0;
    };

    // Atualizar progresso no Firestore 
    const atualizarProgresso = async () => {
        if (id) {
            const unidadeRef = doc(db, 'Unidade', id as string);
            try {
                // Buscar o progresso salvo
                const unidadeSnap = await getDoc(unidadeRef);
                const progressoAtual = unidadeSnap.exists() ? unidadeSnap.data().progresso : 0;

                // Bucando progresso atual
                const progressoCorrente = calcularProgresso();

                // Comparando e atualizando
                if (progressoCorrente > progressoAtual) {
                    await updateDoc(unidadeRef, {
                        progresso: progressoCorrente,
                    });
                    console.log(`Progresso atualizado para: ${progressoCorrente}%`);
                } else {
                    console.log('Progresso já está maior ou igual, não foi atualizado.');
                }
            } catch (error) {
                console.error('Erro ao atualizar progresso:', error);
            }
        }
    };

    // Paginando as lições
    const handleNext = () => {
        if (currentIndex < licoes.length - 1) {
            setCurrentIndex(currentIndex + 1);
            atualizarProgresso(); // Atualiza progresso ao ir para a próxima lição
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            atualizarProgresso(); // Atualiza progresso ao voltar uma lição
        }
    };

    // Função para finalizar a unidade ao concluir todas as lições
    const handleFinalizar = async () => {
        await atualizarProgresso(); // Marca 100% de progresso
        router.push(`/unidades/unidadeV?id=${cursoId}`); // Retorna para a lista de unidades do curso correto
    };

    // Renderizar a lição atual
    const renderCurrentLicao = () => {
        if (isLoading) {
            return <Text>Carregando lições...</Text>; // Exibe mensagem de carregamento enquanto as lições estão sendo carregadas
        }

        if (licoes.length === 0) return <Text>Nenhuma lição encontrada para esta unidade.</Text>;

        const licao = licoes[currentIndex];

        return (
            <View style={styles.card}>
                {isContentLoading ? ( // Exibe um indicador de carregamento ou um texto enquanto espera
                    <Text>Carregando conteúdo...</Text>
                ) : (
                    <>
                        {licao.imagemUrl ? ( // Alterado para imagemUrl
                            <Image
                                source={{ uri: licao.imagemUrl }} // Alterado para imagemUrl
                                style={styles.imagemLicao}
                                onError={(e) => console.log('Erro ao carregar a imagem: ', e.nativeEvent.error)} // Log de erro
                            />
                        ) : (
                            <Text>Imagem não disponível</Text>
                        )}
                        <Text style={styles.licaoTitulo}>{licao.titulo}</Text>
                        <Text style={styles.licaoConteudo}>{licao.conteudo}</Text>
                    </>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <HeaderBar title='Lições' backTo={`/unidades/unidadeV?id=${cursoId}`} />
            {renderCurrentLicao()}

            <View style={styles.navigation}>
                <CustomButton title="Anterior" onPress={handlePrevious} disabled={currentIndex === 0} />
                
                {currentIndex === licoes.length - 1 ? (
                    <CustomButton title="Finalizar" onPress={handleFinalizar} />
                ) : (
                    <CustomButton title="Próximo" onPress={handleNext} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a9efef',
    },
    card: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    imagemLicao: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginTop: 20,
    },
    licaoTitulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: '10%',
        marginBottom: '5%',
    },
    licaoConteudo: {
        fontSize: 20,
        color: '#373637',
        textAlign: 'center',
        flex: 1,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 18,
        position: 'absolute',
        bottom: 10,
    },
});

export default LicaoV;
