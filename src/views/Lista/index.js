import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-elements'
import firebase from '../../config/Database/firebase'
import Icon from 'react-native-vector-icons/FontAwesome5';

class Lista extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('paciente');

        this.state = {
            isLoading: false,
            pacientArr: []
        };
    }

    componentDidMount() {
        this.unsubscribe = this.dbRef.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getCollection = (querySnapshot) => {
        const pacientArr = [];
        querySnapshot.forEach((res) => {
            pacientArr.push({ id: res.id, ...res.data() });
        });
        this.setState(
            this.state = {
                isLoading: false,
                pacientArr: pacientArr
            }
        );
        console.log(this.state.pacientArr)
    }

    listItems() {
        return (
            this.state.pacientArr.map((l, i) => (
                <ListItem
                    containerStyle={{ backgroundColor: '#fff' }}
                    style={{ borderBottomColor: '#ccc', borderBottomWidth: 0.8 }}
                    key={i}
                    onPress={() => {
                        this.props.navigation.navigate('Prontuario', {
                            id: l.id
                        })
                    }}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.titleList}>{l.name}</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitleList}>
                            <View>
                                <Text><Icon name='whatsapp' color='#128c7e' /> {l.mobile} </Text>
                                <Text><Icon name='envelope' color='#555' /> {l.email} </Text>
                            </View>
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))
        );
    }
    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                {
                    this.listItems()
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },

    headerList: { fontWeight: '600', padding: 12, paddingTop: 18, paddingBottom: 18, backgroundColor: '#eee', fontSize: 16 },
    titleList: { fontWeight: '700' },
    subtitleList: { marginTop: 10 }
});

export default Lista;