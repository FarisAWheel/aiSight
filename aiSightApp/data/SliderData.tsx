import {  ImageSourcePropType } from 'react-native';

export type ImageSliderType = {
    title: string;
    image: ImageSourcePropType | any;
    description: string;
    buttonType: string;
}

export const ImageSlider: ImageSliderType[] = [
    {
        title: 'Remembering a person: L-shaped gesture',
        image: require('../assets/rememberPerson.png'),
        description: 'L-shaped gestures',
        buttonType: 'Remember a person',
    },
    {
        title: 'sybau...',
        image: require('../assets/testImage.png'),
        description: 'shh quiet dog',
        buttonType: 'Bakaaaa',
    },
];
