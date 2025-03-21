import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, View, TouchableOpacity, StyleSheet, Button, FlatList} from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'
import RightArrowButton from '../components/RightArrowButton'

const HistoryPage = ({navigation}: {navigation:any}) =>{
    return( 
        <GradientBackground>
            <LeftBackArrowButton onPress={() => navigation.navigate('Home')}/>
            <View style={styles.boxShadow}>
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', left: 10}}>
                    <Text style={styles.text}>People History</Text>
                    <View style = {{flexDirection: 'row', width: '100%', height: '90%', top: 20, left: 30}}>
                        <FlatList
                        // hardcoded data for now
                            data={[
                            {key: 'Faris'},
                            {key: 'Thomas'},
                            {key: 'Kat'},
                            {key: 'Jeff'},
                            {key: 'Isaiah'},
                            {key: 'Emilio'},
                            {key: 'Faris'},
                            {key: 'Thomas'},
                            {key: 'Kat'},
                            {key: 'Jeff'},
                            {key: 'Isaiah'},
                            {key: 'Emilio'},
                            {key: 'Faris'},
                            {key: 'Thomas'},
                            {key: 'Kat'},
                            {key: 'Jeff'},
                            {key: 'Isaiah'},
                            {key: 'Emilio'},
                            ]}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <View style={styles.bulletBox} />
                                    <Text style={styles.item}>{item.key}</Text>
                                </View>
                            )} 
                            />
                        </View>
                </View>
            </View>
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        top: 60,
        height: '80%',
        borderRadius: 60,
        width: '80%',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        fontFamily: 'SF Pro Display', 
        fontWeight: '700',
        color: '#555555',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
    },
    bulletBox: {
        height: 13,
        width: 13,
        backgroundColor: '#9BB5DE',
        marginRight: 25,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
});

export default HistoryPage