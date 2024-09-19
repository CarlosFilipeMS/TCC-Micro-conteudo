import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Licao {
  id: string;
  titulo: string;
}

const IndiceLicoes = ({ licoes, onLicaoSelect }: { licoes: Licao[], onLicaoSelect: (id: string) => void }) => {
  const [selectedLicaoId, setSelectedLicaoId] = useState('');

  const handleLicaoPress = (id: string) => {
    setSelectedLicaoId(id);
    onLicaoSelect(id);
  };

  return (
    <View style={styles.container}>
      {licoes.map((licao) => (
        <TouchableOpacity
          key={licao.id}
          style={[styles.licaoItem, selectedLicaoId === licao.id && styles.selectedLicao]}
          onPress={() => handleLicaoPress(licao.id)}
        >
          <Text style={styles.licaoTitulo}>{licao.titulo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  licaoItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  selectedLicao: {
    backgroundColor: '#e0e0e0',
  },
  licaoTitulo: {
    fontSize: 16,
  },
});

export default IndiceLicoes;
