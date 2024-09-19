import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { db } from "../config/firebase-config";
import { addDoc, collection, getDocs, doc } from "firebase/firestore";

export default function CriarLicao() {
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
  const [unidade, setUnidade] = useState<string | null>(null); // Será uma referência, não string simples
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
    if (!conteudo || !imagem || !unidade) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const unidadeRef = doc(db, "Unidade", unidade); // Criar uma referência ao documento da unidade

      const docRef = await addDoc(collection(db, "Licao"), {
        conteudo: conteudo,
        imagem: imagem,
        unidade: unidadeRef, // Armazenar a referência ao documento da unidade
      });

      Alert.alert("Sucesso", `Lição criada com ID: ${docRef.id}`);

      // Limpar os campos após a criação
      setConteudo("");
      setImagem("");
      setUnidade(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar a lição. Tente novamente.");
      console.error("Erro ao criar lição: ", error);
    }
  };

  return (
    <View>
      <Text>Criar Nova Lição</Text>

      <TextInput
        placeholder="Conteúdo da Lição"
        value={conteudo}
        onChangeText={(text) => setConteudo(text.slice(0, 100))} 
        maxLength={100}
      />

      <TextInput
        placeholder="URL da Imagem"
        value={imagem}
        onChangeText={setImagem}
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
