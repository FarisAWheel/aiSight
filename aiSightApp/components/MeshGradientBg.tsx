import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Image } from 'react-native-svg';

// Define props for the component
interface MeshGradientProps {
    children: ReactNode;
    style?: ViewStyle;
}

const MeshGradient: React.FC<MeshGradientProps> = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Svg height="100%" width="100%" style={styles.svgBackground}>
                <Image
                    href={require('../assets/MeshGradient.svg')} // Path to your SVG file
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svgBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MeshGradient;