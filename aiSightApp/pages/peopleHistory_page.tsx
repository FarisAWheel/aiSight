import React from 'react'
import GradientBackground from '../components/GradientBackground'
import { Text, View, TouchableOpacity, StyleSheet, Button, FlatList, Image} from 'react-native'
import LeftBackArrowButton from '../components/LeftBackArrowButton'
import RightArrowButton from '../components/RightArrowButton'
import { MenuProvider } from 'react-native-popup-menu';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
  } from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/FontAwesome'

const { Popover } = renderers;

const HistoryPage = ({navigation}: {navigation:any}) =>{
    return( 
        <MenuProvider>
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
                                        {/* The three buttons on the side for menu */}
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 20, width: '22%'}}>
                                            <Menu 
                                                renderer={Popover}
                                                rendererProps={{
                                                    placement: 'bottom', // Position the menu below the trigger
                                                    anchorStyle: { backgroundColor: 'white' }, // Customize the anchor
                                                }}
                                                onSelect={value => alert(`Are you sure you want to delete ${value}?`)}
                                                >
                                                <MenuTrigger>
                                                    <Image
                                                            source={require('../assets/threeDots.png')}
                                                            style={{width: 20, height: 20}}
                                                        />
                                                </MenuTrigger>
                                                <MenuOptions>
                                                    <EditOption value={item.key} text='Edit name' />
                                                    <DeleteOption value={item.key} text='Delete'>
                                                    </DeleteOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    </View>
                                )} 
                                />
                            </View>
                    </View>
                </View>
            </GradientBackground>
        </MenuProvider>
    )
}

const DeleteOption: React.FC<{ value: string; text: string }> = (props) => (
    <MenuOption value={props.value}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="trash" size={16} color="#F17070" style={{ marginRight: 8 }} />
            <Text>{props.text}</Text>
        </View>
    </MenuOption>
);
const EditOption: React.FC<{ value: string; text: string }> = (props) => (
    <MenuOption value={props.value}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="pencil" size={16} color="#000" style={{ marginRight: 8 }} />
            <Text>{props.text}</Text>
        </View>
    </MenuOption>
);

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