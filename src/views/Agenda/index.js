import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { format, fromUnixTime, startOfHour, getUnixTime } from 'date-fns'
import { ListItem, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../config/Database/firebase'


class Agenda extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('agenda');
        this.dbPacientesRef = firebase.firestore().collection('paciente');
        this.state = {
            isLoading: true,
            agendaArr: []
        };


    }

    componentDidMount() {
        this.getData()
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData()
        })
        this.props.navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('Sessao')
                }
                }>
                    <Icon name='plus' style={{ marginRight: 20 }} size={20} color='#FFF' />
                </TouchableOpacity>
        })

    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    getData() {
        console.log(new Date())
        let tempAgenda = []
        let tempPaciente = []

        const agenda = this.dbRef.get()
        const paciente = this.dbPacientesRef.get()

        Promise.all([agenda, paciente]).then((res) => {

            res[1].forEach((p) => {
                tempPaciente.push({
                    id: p.id,
                    ...p.data()
                })
            })

            res[0].forEach((a) => {
                const agenda = a.data()
                let paciente = tempPaciente[tempPaciente.findIndex(p => p.id === agenda.paciente.toString())]
                tempAgenda.push({
                    id: a.id,
                    paciente: { name: paciente.name, mobile: paciente.mobile, email: paciente.email },
                    data: agenda.data,
                    hora: agenda.hora
                })
            })

            this.setState(
                this.state = {
                    isLoading: false,
                    agendaArr: tempAgenda
                }
            )
            console.log(this.state.agendaArr)

        })
    }

    deleteAgenda(id) {
        this.stateUpdate(true, 'isLoading')
        this.dbRef.doc(id).delete().then(() => {
            this.getData()
        })
    }
    stateUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    buildList(l, i) {
        return (
            <ListItem.Swipeable
                key={i}
                leftWidth={80}
                rightWidth={80}
                containerStyle={{ borderRadius: 0, borderBottomWidth: 1, borderBottomColor: '#CCC' }}
                leftContent={
                    <TouchableOpacity style={styleAgenda.boxActionEdit} onPressIn={() => {
                        this.props.navigation.navigate('Sessao', {
                            id: l.id
                        })
                    }}>
                        <Icon name='edit' size={30} color='white' />
                    </TouchableOpacity>
                }
                rightContent={
                    <TouchableOpacity style={styleAgenda.boxActionDelete} onPressIn={() => {
                        this.deleteAgenda(l.id)
                    }}>
                        <Icon name='trash' size={30} color='white' />
                    </TouchableOpacity>
                }
            >
                <ListItem.Content>
                    <ListItem.Title style={styleAgenda.titleList}>{l.paciente.name}</ListItem.Title>
                    <ListItem.Subtitle style={styleAgenda.subtitleList}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: '100%' }}>
                            <Text><Icon name='calendar' color='#888' /> {format(fromUnixTime(l.data), 'dd/MM/yyyy')}  </Text>
                            <Text><Icon name='clock' color='#888' /> {l.hora} </Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: '100%' }}>
                            <Text><Icon name='envelope' color='#555' /> {l.paciente.email} </Text>
                            <Text><Icon name='whatsapp' color='#128c7e' /> {l.paciente.mobile} </Text>

                        </View>
                    </ListItem.Subtitle>
                </ListItem.Content>

            </ListItem.Swipeable>
        );
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styleAgenda.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            );
        }

        return (
            <SafeAreaView>
                <ScrollView>
                    <View>
                        <Text style={styleAgenda.headerList}><Icon name='clock' size={16} color='#555' /> Próximos agendamentos</Text>
                        {
                            this.state.agendaArr.map((l, i) => {

                                if (getUnixTime(startOfHour(new Date())) < l.data) {
                                    return this.buildList(l, i)
                                }
                            })
                        }

                        <Text style={styleAgenda.headerList}><Icon name='check' size={16} color='#555' /> Agendamentos anteriores</Text>
                        {
                            this.state.agendaArr.map((l, i) => {
                                if (getUnixTime(startOfHour(new Date())) > l.data) {
                                    return this.buildList(l, i)
                                }
                            })

                        }



                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

}
const styleAgenda = StyleSheet.create({
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxActionEdit: { minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' },
    boxActionDelete: { minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' },
    headerList: { fontWeight: '600', padding: 12, paddingTop: 18, paddingBottom: 18, backgroundColor: '#eee', fontSize: 16 },
    titleList: { fontWeight: '700' },
    subtitleList: { marginTop: 10 }
});
export default Agenda