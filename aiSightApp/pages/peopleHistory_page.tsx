import React, { useState } from 'react';
import GradientBackground from '../components/GradientBackground';
import { Text, View, StyleSheet, FlatList, Image, Alert, Modal, TextInput, Button } from 'react-native';
import LeftBackArrowButton from '../components/LeftBackArrowButton';
import { MenuProvider } from 'react-native-popup-menu';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

const { Popover } = renderers;

const HistoryPage = ({ navigation }: { navigation: any }) => {
    // State to manage the list of people
    const [people, setPeople] = useState([
        { key: 'Faris' },
        { key: 'Thomas' },
        { key: 'Kat' },
        { key: 'Jeff' },
        { key: 'Isaiah' },
        { key: 'Emilio' },
    ]);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [currentPerson, setCurrentPerson] = useState< string | null>(null);
    const [newName, setNewName] = useState('');

    // Function to delete a person from the list
    const deletePerson = (personKey: string) => {
        setPeople((prevPeople) => prevPeople.filter((person) => person.key !== personKey));
    };

    // Function to START editing a person's name
    const startEditing = (personKey: string) => {
        setCurrentPerson(personKey);
        const person = people.find((p) => p.key === personKey);
        setNewName(person?.key || '');
        setIsEditing(true);
    };

    // Function to save the edited name
    const saveEdit = () => {
        setPeople((prevPeople) =>
            prevPeople.map((person) => 
                person.key === currentPerson ? { ...person, key: newName } : person
            )
        );
        setIsEditing(false);
        setCurrentPerson(null);
        setNewName('');
    }

    return (
        <MenuProvider>
            <GradientBackground>
                <LeftBackArrowButton onPress={() => navigation.navigate('Home')} />
                <View style={styles.boxShadow}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', left: 10 }}>
                        <Text style={styles.text}>People History</Text>
                        <View style={{ flexDirection: 'row', width: '100%', height: '90%', top: 20, left: 30 }}>
                            <FlatList
                                data={people}
                                renderItem={({ item }) => (
                                    <View style={styles.listItem}>
                                        <View style={styles.bulletBox} />
                                        <Text style={styles.item}>{item.key}</Text>
                                        {/* The three buttons on the side for menu */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 20, width: '22%' }}>
                                            <Menu
                                                renderer={Popover}
                                                rendererProps={{
                                                    placement: 'bottom',
                                                    anchorStyle: { backgroundColor: 'white' },
                                                    popoverStyle: {
                                                        shadowColor: '#000',
                                                        shadowOffset: { width: 0, height: 0 },
                                                        shadowOpacity: 0.9,
                                                        shadowRadius: 10,
                                                        elevation: 10,
                                                        backgroundColor: 'red',
                                                        borderRadius: 8,
                                                    },
                                                }}
                                                onSelect={(value) => {
                                                    if (value.action === 'delete') {
                                                        Alert.alert(
                                                            "Caution",
                                                            `Are you sure you want to delete ${value.person}?`,
                                                            [
                                                                { text: "Cancel", style: "cancel" },
                                                                { text: "Yes", onPress: () => {
                                                                    console.log(`Deleted ${value.person}`);
                                                                    deletePerson(value.person);
                                                                }},
                                                            ]
                                                        );
                                                    }
                                                    else if(value.action === 'edit') {
                                                        startEditing(value.person);
                                                    }
                                                }}
                                            >
                                                <MenuTrigger>
                                                    <Image
                                                        source={require('../assets/threeDots.png')}
                                                        style={{ width: 20, height: 20 }}
                                                    />
                                                </MenuTrigger>
                                                <MenuOptions>
                                                    <EditOption value={item.key} text="Edit name" />
                                                    <DeleteOption value={item.key} text="Delete" />
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

            {/* Modal for editing the name */}
            <Modal visible={isEditing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Enter new name"
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setIsEditing(false)} color={'#555555'}/>
                            <Button title="Save" onPress={saveEdit} color={'#9BB5DE'} />
                        </View>
                    </View>
                </View>
            </Modal>
        </MenuProvider>
    );
};

const DeleteOption: React.FC<{ value: string; text: string }> = (props) => (
    <MenuOption value={{ action: 'delete', person: props.value }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="trash" size={16} color="#F17070" style={{ marginRight: 8 }} />
            <Text>{props.text}</Text>
        </View>
    </MenuOption>
);

const EditOption: React.FC<{ value: string; text: string }> = (props) => (
    <MenuOption value={{ action: 'edit', person: props.value }}>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555555',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default HistoryPage;