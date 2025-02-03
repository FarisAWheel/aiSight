import React from "react";
import { View, StyleSheet } from "react-native";

interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BoundingBoxOverlayProps {
    boxes: Box[];
}

const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({ boxes }) => {
    return (
        <View style={StyleSheet.absoluteFill}>
            {boxes.map((box, index) => (
                <View
                    key={index}
                    style={{
                        position: "absolute",
                        left: box.x,
                        top: box.y,
                        width: box.width,
                        height: box.height,
                        borderWidth: 2,
                        borderColor: "red",
                    }}
                />
            ))}
        </View>
    );
};

export default BoundingBoxOverlay;
