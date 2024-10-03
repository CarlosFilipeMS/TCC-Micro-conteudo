import * as React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/botao';
import { auth } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/headerBar';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('O e-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirme sua senha'),
});

export interface CadastroscreenProps {}

export default function Cadastroscreen(props: CadastroscreenProps) {
  const initialValues: FormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      router.push('auth/login')
      alert('Conta criada com sucesso!')
      // Navegar para outra tela ou exibir mensagem de sucesso

    } catch (error) {
      alert('Falha ao criar conta!')
    }
  };

  return (
    <View style={styles.background}>
      <HeaderBar title=''/>
      <View style={styles.content}>
        <View style={styles.cabecalho}>
          <View style={styles.authIconView}>
            <Image style={styles.authIcon} source={require('../../../assets/logo/logo.png')} />
          </View>
          <Text style={styles.titlePage}>Cadastro</Text>
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

                <Text>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}

                <CustomButton onPress={handleSubmit} title="Cadastrar" color="black" />
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
    backgroundColor: '#6ddbd7',
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
  authIconView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  authIcon: {
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
});