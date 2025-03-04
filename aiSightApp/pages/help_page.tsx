import React from 'react'
import { View, Text } from 'react-native'
import GradientBackground from '../components/GradientBackground'
import { useNavigation } from '@react-navigation/native'


const HelpPage = () => {
    return (
        <GradientBackground>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Help Page</Text>
                <Text style={{ marginTop: 20 }}>This is the help page content.</Text>
            </View>
        </GradientBackground>
    )
}

export default HelpPage;