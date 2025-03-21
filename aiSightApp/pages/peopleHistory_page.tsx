import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, View, TouchableOpacity, StyleSheet, Button} from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'
import RightArrowButton from '../components/RightArrowButton'

const HistoryPage = ({navigation}: {navigation:any}) =>{
    return( 
        <GradientBackground>
            <LeftBackArrowButton onPress={() => navigation.navigate('Home')}/>
            <View style={styles.boxShadow}>
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.text}>People History</Text>
                </View>
            </View>
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        top: 60,
        height: '80%',
        borderRadius: 60,
        width: '80%',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        fontFamily: 'SF Pro Display', 
        fontWeight: '700',
        color: '#555555',
    }
});

export default HistoryPage