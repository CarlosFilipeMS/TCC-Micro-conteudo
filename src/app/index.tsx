import { View, Text, Button } from 'react-native'
import { Link, router } from 'expo-router'

export default function Home(){

    return(
        <View>
            <Button title='Cursos' onPress={() => router.push('/cursos')}/>
            <Button title='Criar Tela' onPress={() => router.push('/criarLicao')}/>
        </View>
    )
}