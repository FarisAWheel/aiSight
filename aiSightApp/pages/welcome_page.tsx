import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const WelcomePage = () => {
    return (
        <LinearGradient
            colors={['#9FD2F0', '#BADFC0', '#9BB5DE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* <Image source = {require('../assets/aiSIghtLogo.png')} style={styles.logo}/> */}
            
                <Text style={styles.helloText}>Hello,</Text>
                <Text style={styles.welcomeText}>Welcome to AiSight!</Text>
                <View style={styles.line} />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get started</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // paddingLeft: 50,
    },
    helloText: {
        fontSize: 48,
        fontStyle: 'italic',
        color: 'white',
    },
    welcomeText: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    line: {
        width: 150,
        height: 1,
        backgroundColor: 'white',
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5, // For Android shadow
    },
    buttonText: {
        fontSize: 18,
        color: '#9BB5DE',
        fontWeight: 'bold',
        marginRight: 10,
    },
    logo:{
        width: 300,
        height: 300,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 50,
    }
});

export default WelcomePage;