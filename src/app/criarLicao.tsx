import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { db } from "../config/firebase-config";
import { addDoc, collection, getDocs, doc } from "firebase/firestore";

export default function CriarLicao() {
  const [titulo, setTitulo] = useState(""); // Novo estado para o título
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
  const [unidade, setUnidade] = useState<string | null>(null); // Será uma referência, não string simples
  const [ordem, setOrdem] = useState<number | null>(null); // Novo campo para definir a ordem da lição
  const [unidades, setUnidades] = useState<any[]>([]); // Lista de unidades para o usuário selecionar

  // Função para buscar as unidades do Firestore
  const fetchUnidades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Unidade"));
      const unidadesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUnidades(unidadesList);
    } catch (error) {
      console.error("Erro ao buscar unidades: ", error);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  // Função para criar uma nova lição no Firestore
  const criarLicao = async () => {
    if (!titulo || !conteudo || !imagem || !unidade || ordem === null) {
      Alert.alert("Erro", "Por favor, preencha todos os campos, incluindo a ordem.");
      return;
    }

    try {
      const unidadeRef = doc(db, "Unidade", unidade); // Criar uma referência ao documento da unidade

      const docRef = await addDoc(collection(db, "Licao"), {
        titulo: titulo,
        conteudo: conteudo,
        imagem: imagem,
        unidade: unidadeRef,  // Armazenar a referência ao documento da unidade
        ordem: ordem          // Adicionar o campo de ordem
      });

      Alert.alert("Sucesso", `Lição criada com ID: ${docRef.id}`);

      // Limpar os campos após a criação
      setTitulo("");
      setConteudo("");
      setImagem("");
      setUnidade(null);
      setOrdem(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar a lição. Tente novamente.");
      console.error("Erro ao criar lição: ", error);
    }
  };

  return (
    <View>
      <Text>Criar Nova Lição</Text>

      <TextInput
        placeholder="Título da Lição"
        value={titulo}
        onChangeText={(text) => setTitulo(text.slice(0, 25))} // Limitar o título a 25 caracteres
        maxLength={25}
      />

      <TextInput
        placeholder="Conteúdo da Lição"
        value={conteudo}
        onChangeText={setConteudo} 
        maxLength={100}
      />

      <TextInput
        placeholder="URL da Imagem"
        value={imagem}
        onChangeText={setImagem}
      />

      <TextInput
        placeholder="Ordem da Lição (número inteiro)"
        value={ordem ? ordem.toString() : ""}
        onChangeText={(text) => setOrdem(parseInt(text, 10))}
        keyboardType="numeric" // Teclado numérico para facilitar a entrada de números
      />

      <Text>Selecione a Unidade:</Text>
      {unidades.length > 0 ? (
        <FlatList
          data={unidades}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: unidade === item.id ? '#ddd' : '#fff',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#ccc',
              }}
              onPress={() => setUnidade(item.id)} // Salva o id da unidade selecionada
            >
              <Text>{item.nomeUnidade}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Carregando unidades...</Text>
      )}

      <Button title="Criar Lição" onPress={criarLicao} />
    </View>
  );
}
