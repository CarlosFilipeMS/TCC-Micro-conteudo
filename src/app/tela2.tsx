import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, FlatList } from "react-native";
import { db } from "../config/firebase-config";
import { addDoc, collection } from "firebase/firestore";

export default function CriarLicao() {
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
  const [unidade, setUnidade] = useState("");
  const [licaoIds, setLicaoIds] = useState<string[]>([]); // Array para armazenar os IDs das lições

  // Função para criar uma nova lição no Firestore
  const criarLicao = async () => {
    if (!conteudo || !imagem || !unidade) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "Licao"), {
        conteudo: conteudo,
        imagem: imagem,
        unidade: unidade,
      });

      setLicaoIds((prevIds) => [...prevIds, docRef.id]); // Adiciona o novo ID ao array de IDs
      Alert.alert("Sucesso", `Lição criada com ID: ${docRef.id}`); // Corrigido template string

      // Limpar os campos após a criação
      setConteudo("");
      setImagem("");
      setUnidade("");
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
        onChangeText={(text) => setConteudo(text.slice(0, 8))} // Limita o texto a 8 caracteres
        maxLength={100} // Limita o campo a 8 caracteres
      />

      <TextInput
        placeholder="URL da Imagem"
        value={imagem}
        onChangeText={setImagem}
      />

      <TextInput
        placeholder="Unidade"
        value={unidade}
        onChangeText={setUnidade}
      />

      <Button title="Criar Lição" onPress={criarLicao} />

      <Text style={{ marginTop: 20 }}>IDs das Lições Criadas:</Text>

      {licaoIds.length > 0 ? ( // Verifica se há IDs na lista antes de exibir
        <FlatList
          data={licaoIds}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Text>{item}</Text> // Exibe cada ID de lição
          )}
        />
      ) : (
        <Text>Nenhuma lição criada ainda.</Text> // Exibe uma mensagem se não houver IDs
      )}
    </View>
  );
}
