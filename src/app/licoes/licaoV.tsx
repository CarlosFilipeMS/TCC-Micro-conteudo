import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, doc, orderBy, updateDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';


interface Licao {
    id: string;
    titulo: string;
    conteudo: string;
    unidade: string;
    imagem: string;
}

const LicaoV = () => {
    const { id, cursoId } = useLocalSearchParams(); // Agora capturamos o cursoId também
    const [licoes, setLicoes] = useState<Licao[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const router = useRouter(); // Para navegação de volta às unidades

    // Buscar as lições de uma unidade
    const fetchLicoes = async () => {
        if (id) {
            try {
                const unidadeRef = doc(db, 'Unidade', id as string);

                // Query das lições que fazem referência à unidade
                const licoesQuery = query(
                    collection(db, 'Licao'),
                    where('unidade', '==', unidadeRef),
                    orderBy('ordem') // Ordenando pelas lições
                );

                const querySnapshot = await getDocs(licoesQuery);
                const licoesList: Licao[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Licao));

                setLicoes(licoesList);
            } catch (error) {
                console.error('Erro ao buscar lições: ', error);
            }
        }
    };

    useEffect(() => {
        fetchLicoes();
    }, [id]);

    // Função para calcular o progresso
    const calcularProgresso = () => {
        if (licoes.length > 0) {
            return ((currentIndex + 1) / licoes.length) * 100; // Progresso em porcentagem
        }
        return 0;
    };

    // Atualizar progresso da unidade no Firestore
    const atualizarProgresso = async () => {
        if (id) {
            const unidadeRef = doc(db, 'Unidade', id as string);
            const progresso = calcularProgresso();

            try {
                await updateDoc(unidadeRef, {
                    progresso: progresso, // Atualiza o progresso da unidade
                });
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
        if (licoes.length === 0) return <Text>Nenhuma lição encontrada para esta unidade.</Text>;

        const licao = licoes[currentIndex];
        return (
            <View style={styles.card}>
                <Image source={{ uri: licao.imagem }} style={styles.image} />
                <Text style={styles.licaoTitulo}>{licao.titulo}</Text>
                <Text style={styles.licaoConteudo}>{licao.conteudo}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderCurrentLicao()}

            <View style={styles.navigation}>
                <Button title="Anterior" onPress={handlePrevious} disabled={currentIndex === 0} />
                
                {/* Se for a última lição, exibe "Finalizar", senão "Próximo" */}
                {currentIndex === licoes.length - 1 ? (
                    <Button title="Finalizar" onPress={handleFinalizar} />
                ) : (
                    <Button title="Próximo" onPress={handleNext} />
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
        backgroundColor: '#f8f8f8',
    },
    card: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
    },
    licaoTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    licaoConteudo: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 16,
        position: 'absolute',
        bottom: 10,
    },
});

export default LicaoV;
