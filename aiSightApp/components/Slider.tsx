import { StyleSheet, View, ViewToken } from 'react-native';
import React, { useState, useRef } from 'react';
import { ImageSliderType } from '../data/SliderData';
import SliderItem from './SliderItem';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Pagination from './Pagniation';

type Props = {
    itemList: ImageSliderType[];
};

const Slider = ({ itemList }: Props) => {
    const scrollX = useSharedValue(0);
    const [paginationIndex, setPaginationIndex] = useState(0); // Correct usage of useState
    
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        }
    });

    const onViewableItemsChanged = ({viewableItems} : {viewableItems: ViewToken[] }) => {
        if(viewableItems[0].index !== undefined && viewableItems[0].index !== null )
            {
                setPaginationIndex(viewableItems[0].index);
            }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    }

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ]);

    return (
        <View>
            <Animated.FlatList
                data={itemList} 
                renderItem={({ item, index }) => (
                    <SliderItem item={item} index={index} scrollX={scrollX} /> 
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
            <Pagination items={itemList} scrollX={scrollX} paginationIndex={paginationIndex}/>
        </View>
    );
}

export default Slider;

const styles = StyleSheet.create({});