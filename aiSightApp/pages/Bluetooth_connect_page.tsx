import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, TouchableOpacity, StyleSheet, Button} from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'
import RightArrowButton from '../components/RightArrowButton'

const BluetoothPage = ({navigation}: {navigation:any}) =>{
    return( 
        <GradientBackground>
            <LeftBackArrowButton onPress={() => navigation.navigate('Welcome')}/>
            <Text>This is Bluetooth Page</Text>
            <RightArrowButton onPress={() => navigation.navigate('Home')}/>
        </GradientBackground>
    )
}

export default BluetoothPage