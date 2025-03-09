import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ImageSliderType } from '../data/SliderData';
import { SharedValue } from 'react-native-reanimated';

type Props = {
    items: ImageSliderType[];
    paginationIndex: number;
    scrollX: SharedValue<number>;
}

const Pagination = ({ items, paginationIndex, scrollX }: Props) => {
    return (
        <View style={styles.container}>
            {items.map((_, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.dot, 
                        { backgroundColor: paginationIndex === index ? '#555555' : '#aaa' }
                    ]} 
                />
            ))}
        </View>
    );
}

export default Pagination;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 12,
        bottom: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#aaa',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    }
});