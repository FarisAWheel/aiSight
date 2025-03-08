import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, StyleSheet, View, Dimensions, Image, ImageBackground, Button, TouchableOpacity } from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'
import Slider from '../components/Slider'
import { LinearGradient } from 'expo-linear-gradient'
import {Svg} from 'react-native-svg'
import { ImageSlider } from '../data/SliderData'
import Animated, { useAnimatedScrollHandler, SharedValue } from 'react-native-reanimated';



const { width: deviceWidth } = Dimensions.get('window');
const logoBg = require('../assets/logoBg.png');
const bgImage = require('../assets/bgImage.png');

const HomePage = ({navigation}: {navigation:any}) => {
    return( 
        <ImageBackground source={bgImage} style={styles.backgroundImage}>
            <View
                style={[
                    styles.container,
                    {
                        flexDirection: 'column',
                    },
                ]}
            >
                {/* Top part */}
                <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.topContainer}>
                        <Image source={logoBg} style={styles.logo} />
                        <View style={styles.innerTop}>
                            <Text style={styles.topText}>Hi there, what can I do for you?</Text>
                            <View style={styles.line} />
                        </View>
                    </View>
                </View>

                {/* Middle Main Box */}
                <View style={styles.boxShadow}>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.76)', 'rgba(216, 212, 212, 0)', 'rgba(255, 255, 255, 0.65)']}
                        style={styles.mainBox}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <View style={styles.flexBox} testID='mainContainer'>
                            <Text style={styles.view1Text}>Hand Gestures</Text>
                            {/* rectangle where demonstration image will be */}
                            {/* <View style={styles.rectangle}>
                            </View> */}
                            <Slider itemList={ImageSlider}/>
                            {/* Instructions */}
                        <View style={{height: '12%', width: '95%', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                        </View>
                        </View>
                    </LinearGradient>
                </View>

                

                {/* Bottom Portion */}
                <View style={{justifyContent: 'center', alignItems: 'center'}} />
                    <View style={{height: '10%', width: '70%'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Bluetooth')}>
                            <LinearGradient
                                colors={['#BADFC0', '#9FD2F0']}
                                style={styles.viewFeedButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1.5 }}
                            >
                                    <Text style={styles.ViewfeedText}>View live AiSight feed</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                            <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Bluetooth')}>
                                        <Text style={styles.ViewbuttonText}>Settings</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('Bluetooth')}>
                                        <Text style={styles.ViewbuttonText}>People History</Text>
                                    </TouchableOpacity>
                            </View>
                    </View>
            </View>
        </ImageBackground>
    )
}

// Styles
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: .80,
        width: '100%',
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingTop: 20,
        marginLeft: 120,
        justifyContent: 'flex-end',
    },
    innerTop: {
        flexDirection: 'column',
    },
    logo: {
        width: 80,
        height: 80,
    },
    topText: {
        // Hi there, what can I do for you?
        color: 'white', 
        fontSize: 25, 
        fontFamily: 'SF Pro Display', 
        fontStyle: 'italic', 
        fontWeight: '600',
        width: '80%',
        paddingLeft: 25,
        paddingTop: 17,
        marginBottom: 0,
    },
    line: {
        alignContent: 'flex-end',
        width: '70%',
        height: 0, 
        opacity: 0.50, 
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        paddingTop: 10,
    },
    mainBox: {
        flex: 3.2,
        width: deviceWidth,
        alignItems: 'center',
    },
    boxShadow: {
        flex: 3.2,
        width: deviceWidth,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        backgroundColor: 'transparent',
        shadowRadius: 18,
    },
    flexBox: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    // Hand gestures text
    view1Text: {
        alignItems: 'center',
        left: '30%',
        paddingTop: 13,
        color: '#555555', 
        fontSize: 23,   
        fontFamily: 'SF Pro Display', 
        fontWeight: '700', 
        letterSpacing: 1.12,
    },
    rectangle: {
        width: 332, 
        height: 236.97, 
        backgroundColor: 'white', 
        borderRadius: 32,
        marginTop: 10,
    },
    instructionText: {
        width: '100%',
        color: '#555555', 
        fontSize: 18, 
        fontFamily: 'SF Pro Display', 
        fontWeight: '600',
        paddingTop: 10,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    viewFeedButton: {
        width: '120%', 
        height: '70%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        left: 30,
        shadowColor: '#000',
        shadowOffset: { width: 272, height: 50 },
        shadowOpacity: 0.25,
        shadowRadius: 7.2,
        elevation: 8,
    },
    instructionButton: {
        width: '75%', 
        height: '100%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    settingsButton: {
        backgroundColor: '#FFFFFF',
        width: '50%', 
        height: '75%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginRight: 20,
        left: 30,
        shadowColor: '#000',
        shadowOffset: { width: 272, height: 50 },
        shadowOpacity: 0.25,
        shadowRadius: 7.2,
        elevation: 8,
    },
    historyButton: {
        backgroundColor: '#FFFFFF',
        width: '65%', 
        height: '75%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginRight: 20,
        left: 30,
        shadowColor: '#000',
        shadowOffset: { width: 272, height: 50 },
        shadowOpacity: 0.25,
        shadowRadius: 7.2,
        elevation: 8,
    },
    buttonText: {
        // Remember a person
        color: 'white', 
        fontSize: 20, 
        fontFamily: 'SF Pro Display', 
        fontWeight: '700',
    },
    ViewbuttonText: {
        // Remember a person
        color: '#555555', 
        fontSize: 23, 
        fontFamily: 'SF Pro Display', 
        fontWeight: '600',
    },
    ViewfeedText: {
        // Remember a person
        color: '#555555', 
        fontSize: 23, 
        fontFamily: 'SF Pro Display', 
        fontWeight: '700',
    },
});

export default HomePage