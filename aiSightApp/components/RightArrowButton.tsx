import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RightArrowButton = ({ onPress }:{onPress:any}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name='arrow-forward' style={styles.arrow}></Ionicons>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30
    },
    arrow:{
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    }
});

export default RightArrowButton