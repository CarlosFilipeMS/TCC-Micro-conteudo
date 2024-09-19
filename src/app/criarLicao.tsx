import React, { useState, useEffect } from "react";
import { View, Text, TextInput, SafeAreaView, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../config/firebase-config";
import { addDoc, collection, getDocs, doc } from "firebase/firestore";

export default function CriarLicao() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");
  const [unidade, setUnidade] = useState<string | null>(null); // referência
  const [ordem, setOrdem] = useState<number | null>(null);
  const [unidades, setUnidades] = useState<any[]>([]); // Lista de unidades


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
        unidade: unidadeRef,  
        ordem: ordem          
      });

      Alert.alert("Sucesso", `Lição criada com ID: ${docRef.id}`);


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
    <View
      style={styles.container}
    >
      <View
        style={styles.formDiv}
      >
        <Text>Criar Nova Lição</Text>

        <TextInput
          placeholder="Título da Lição"
          value={titulo}
          onChangeText={(text) => setTitulo(text.slice(0, 25))} // Limitar o título a 25 caracteres
          maxLength={25}
          style={styles.normalInput}
        />
        <SafeAreaView
          style={styles.conteudoInput}
        >
        <TextInput
          placeholder="Conteúdo da Lição"
          multiline
          value={conteudo}
          onChangeText={setConteudo} 
          maxLength={100}
        />
        </SafeAreaView>

        <TextInput
          placeholder="URL da Imagem"
          value={imagem}
          onChangeText={setImagem}
          style={styles.normalInput}
        />

        <TextInput
          placeholder="Ordem da Lição (número inteiro)"
          value={ordem ? ordem.toString() : ""}
          onChangeText={(text) => setOrdem(parseInt(text, 10))}
          keyboardType="numeric" // Teclado numérico para facilitar a entrada de números
          style={styles.normalInput}
        />

        <Text>Selecione a Unidade:</Text>
        {unidades.length > 0 ? (
          <FlatList
            data={unidades}
            keyExtractor={(item) => item.id}
            style={styles.selectUnidade}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: unidade === item.id ? '#ddd' : '#fff',
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                }}
                onPress={() => setUnidade(item.id)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formDiv: {
    width: "80%",
    height: "80%",
  },
  normalInput: {
    marginTop: 10,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "grey",
    borderWidth: 1,
    height: "6%",
  },
  conteudoInput: {
    marginTop: 10,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "grey",
    borderWidth: 1,
    height: "25%",
  },
  selectUnidade: {

  },
  
})