import { View, Text, Button } from 'react-native'
import { Link, router } from 'expo-router'

export default function Home(){

    return(
        <View>
            <Button title='Tela 1' onPress={() => router.push('/tela1')}/>
            <Button title='Tela 2' onPress={() => router.push('/tela2')}/>
        </View>
    )
}