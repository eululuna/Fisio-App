import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ListItem, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../config/Database/firebase'

const list = [
    {
        name: 'Amy Farha',
        email: 'reacaosistemas@gmail.com',
        data: '01/11/2021',
        mobile: '54992257145'
    },
    {
        name: 'Chris Jackson',
        email: 'reacaosistemas@gmail.com',
        data: '03/11/2021',
        mobile: '54992257145'
    },

]


class Agenda extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('agenda');
        this.dbPacientesRef = firebase.firestore().collection('paciente');
        this.state = {
            isLoading: false,
            pacientArr: [],
            agendaArr: []
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
        const agendaArr = [];
        querySnapshot.forEach((res) => {
            agendaArr.push({ id: res.id, ...res.data() });
        })

        if (agendaArr.length) {
            agendaArr.forEach((p) => {
                let temp = []
                this.dbPacientesRef.doc(p.paciente.toString()).get().then((res) => {
                    if (res.exists) {
                        temp.push(res.data());

                    } else {
                        console.log("Paciente não encontrado!");
                    }
                });
            })
        }
        this.setState(
            this.state = {
                ...this.state,
                isLoading: false,
                pacientArr: pacientArr,
                agendaArr: agendaArr
            }
        );
        console.log(this.state.agendaArr)
    }

    listSwipeable() {
        return (
            list.map((l, i) => (
                <ListItem.Swipeable
                    key={i}
                    leftWidth={80}
                    rightWidth={80}
                    containerStyle={{ borderRadius: 0 }}
                    leftContent={
                        <TouchableOpacity style={styleAgenda.boxActionEdit} onPress={() => { }}>
                            <Icon name='edit' size={30} color='white' />
                        </TouchableOpacity>
                    }
                    rightContent={
                        <TouchableOpacity style={styleAgenda.boxActionDelete} onPress={() => { }}>
                            <Icon name='trash' size={30} color='white' />
                        </TouchableOpacity>
                    }
                >
                    <ListItem.Content>
                        <ListItem.Title>{l.name}</ListItem.Title>
                        <ListItem.Subtitle>{l.data}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>

            ))
        );
    }
    listItems() {
        return (
            this.state.pacientArr.map((l, i) => (
                <ListItem
                    containerStyle={{ backgroundColor: '#fff' }}
                    style={{ borderBottomColor: '#ccc', borderBottomWidth: 0.8 }}
                    key={i}
                    onPress={() => { }}>
                    <ListItem.Content>
                        <ListItem.Title style={styleAgenda.titleList}>{l.name}</ListItem.Title>
                        <ListItem.Subtitle style={styleAgenda.subtitleList}>
                            <View>
                                <Text><Icon name='calendar' color='#888' /> {l.data} </Text>
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
    render = () => {

        this.props.navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => { }
                }>
                    <Icon name='plus' style={{ marginRight: 20 }} size={20} color='#FFF' />
                </TouchableOpacity>

        });

        return (
            <SafeAreaView>
                <ScrollView>
                    <View>
                        <Text style={styleAgenda.headerList}><Icon name='clock' size={16} color='#555' /> Próximos agendamentos</Text>
                        {

                            this.listItems()
                        }
                    </View>
                    <View>
                        <Text style={styleAgenda.headerList}><Icon name='check' size={16} color='#555' /> Agendamentos concluídos</Text>
                        {
                            this.listSwipeable()

                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

}
const styleAgenda = StyleSheet.create({
    boxActionEdit: { minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' },
    boxActionDelete: { minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' },
    headerList: { fontWeight: '600', padding: 12, paddingTop: 18, paddingBottom: 18, backgroundColor: '#eee', fontSize: 16 },
    titleList: { fontWeight: '700' },
    subtitleList: { marginTop: 10 }
});
export default Agenda