import * as React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/botao';
import HeaderBar from '../../components/headerBar';

const RecuperarSenhaScreen = () => {
  const [email, setEmail] = React.useState('');
  const router = useRouter();

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Um link de recuperação foi enviado para seu e-mail.');
      setEmail('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar o e-mail de recuperação. Verifique o e-mail informado.');
    }
  };

  return (
    <View style={styles.background}>
      <HeaderBar title={''}/>
      <View style={styles.content}>
        <View style={styles.cabecalho}>
          <View style={styles.logoView}>
            <Image style={styles.logo} source={require('../../../assets/logo/logo.png')} />
          </View>
          <Text style={styles.titlePage}>Recuperar Senha</Text>
        </View>
        <View style={styles.inputsContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomButton onPress={handlePasswordReset} title="Enviar link" color="black" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#a9efef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    height: '90%',
    alignItems: 'center',
  },
  cabecalho: {
    width: '100%',
    height: '40%',
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  logo: {
    width: '200%',
    height: '200%',
  },
  titlePage: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  inputsContainer: {
    marginTop: '10%',
    width: '90%',
    height: '30%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    padding: 6,
    marginBottom: 12,
    borderRadius: 4,
    width: '100%',
  },
  registerButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#444444',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  registerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecuperarSenhaScreen;
