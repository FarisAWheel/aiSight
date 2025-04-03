import React from 'react'
import {Image, StyleSheet} from 'react-native';

const cameraView = () => {
    let cameraViewStream = '192.168.4.1/stream'


    return(
        <Image source={{
            uri: cameraViewStream
        }}/>
    )
}