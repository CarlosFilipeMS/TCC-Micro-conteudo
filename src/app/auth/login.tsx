import * as React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/botao';
import { auth } from '../../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('O e-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
});

export interface LoginScreenProps {}

export default function LoginScreen(props: LoginScreenProps) {
  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      router.push('/')
      alert('Usuário autenticado com sucesso!');

    } catch (error) {
      alert('Usuário ou senha incorretos!');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <View style={styles.cabecalho}>
          <View style={styles.logoView}>
            <Image style={styles.logo} source={require('../../../assets/logo/logo.png')} />
          </View>
          <Text style={styles.titlePage}>Login</Text>
        </View>
        <View style={styles.inputsContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.container}>
                <Text>E-mail</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <Text>Senha</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <CustomButton onPress={handleSubmit as any} title="Entrar" color="black" />
                
                <TouchableOpacity 
                  style={styles.registerButton} 
                  onPress={() => router.push('/auth/cadastro')}
                >
                  <Text style={styles.registerText}>Cadastrar</Text>
                </TouchableOpacity>
                <View style={styles.linkRecuperar}>
                  <Link href="/auth/recuperar">
                    <Text style={styles.textoLinkRecuperar}>Esqueci minha senha</Text>
                  </Link>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
}

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
  linkRecuperar: {
    marginTop: 8,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoLinkRecuperar: {
    fontWeight: 'bold',
    fontSize: 15
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
    alignItems: 'center',
    width: '200%',
    height: '200%',
  },
  titlePage: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputsContainer: {
    marginTop: '10%',
    width: '90%',
    height: '40%',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    width: '100%',
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    padding: 6,
    marginBottom: 4,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 6,
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
