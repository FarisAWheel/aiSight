import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define props for the component
interface GradientBackgroundProps {
    children: ReactNode;
    style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
    return (
        <LinearGradient
            colors={['#9FD2F0', '#BADFC0', '#9BB5DE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GradientBackground;