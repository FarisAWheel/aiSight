import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'

const BluetoothPage = ({navigation}: {navigation:any}) =>{
    return( 
        <GradientBackground>
            <LeftBackArrowButton onPress={() => navigation.navigate('Welcome')}/>
            <Text>This is Bluetooth Page</Text>
        </GradientBackground>
    )
}

export default BluetoothPage