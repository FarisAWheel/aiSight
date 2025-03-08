import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { ImageSliderType } from '../data/SliderData';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
    item: ImageSliderType;
    index: number;
    scrollX: SharedValue<number>;
    buttonText: string;
}

const { width } = Dimensions.get('screen');

const SliderItem = ({ item, index, scrollX, buttonText }: Props) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.25, 0, width * 0.25],
                        Extrapolation.CLAMP,
                    ),
                },
            ]
        };
    });
    return (
        <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
            <Image source={item.image} style={{
                width: 332,
                height: 236.97,
                backgroundColor: 'white',
                borderRadius: 32,
                marginTop: 10,
            }}
            />
            <Text style={styles.instructionText}>{item.title}</Text>
            <LinearGradient
                colors={['#9BB5DE', '#BCE6FF']}
                style={styles.instructionButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
        </Animated.View>
    );
}

export default SliderItem;

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
        gap: 0,
        width: width,
    },
    instructionButton: {
        width: '55%',
        height: '12%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
    },
    instructionText: {
        width: '100%',
        color: '#555555',
        fontSize: 18,
        fontFamily: 'SF Pro Display',
        fontWeight: '600',
        marginTop: 25,
        marginBottom: 15,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'SF Pro Display',
        fontWeight: '700',
    },
});