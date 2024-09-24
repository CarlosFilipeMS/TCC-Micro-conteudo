import * as React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/botao';
import { auth } from '../../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

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
          <Text style={styles.textLogo}>NanoK</Text>
          <View style={styles.authIconView}>
            <Image style={styles.authIcon} source={require('../../../assets/authIcons/conecte-se.png')} />
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
    backgroundColor: '#adec94',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    height: '90%',
    alignItems: 'center',
  },
  cabecalho: {
    width: '70%',
    height: '40%',
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogo: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  authIconView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  authIcon: {
    alignItems: 'center',
    width: 180,
    height: 180,
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
    padding: 6,
    marginBottom: 4,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 6,
  },
});