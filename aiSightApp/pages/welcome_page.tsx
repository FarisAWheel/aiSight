import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import  GradientBackground  from '../components/GradientBackground'
import Icon from 'react-native-vector-icons/FontAwesome';

const bgImage = require('../assets/welcomeBg.png');

//welcome page
const WelcomePage = ({navigation}:{navigation:any}) => {
    return (
        <ImageBackground source={bgImage} style={styles.backgroundImage}>
                <Text style={styles.helloText}>Hello,</Text>
                <Text style={styles.welcomeText}>Welcome to AiSight!</Text>
                <View style={styles.line} />

            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Bluetooth')}}>
                <Text style={styles.buttonText}>Get started</Text>
                <Icon name="arrow-right" size={34} color="#9BB5DE" />
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helloText: {
        fontSize: 58,
        fontStyle: 'italic',
        color: 'white',
        fontWeight: 600,
    },
    welcomeText: {
        fontSize: 30,
        color: 'white',
        marginBottom: 20,
    },
    line: {
        width: 150,
        height: 1,
        backgroundColor: 'white',
        marginBottom: 60,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 0,
        paddingVertical: 25,
        paddingHorizontal: 40,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5, // For Android shadow
    },
    buttonText: {
        fontSize: 28,
        color: '#9BB5DE',
        marginRight: 25,
    }
});

export default WelcomePage;