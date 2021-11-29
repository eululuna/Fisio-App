import { differenceInYears, format, getTime, fromUnixTime, millisecondsToSeconds } from 'date-fns'

import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Alert, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import firebase from './../../config/Database/firebase';

class Prontuario extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('paciente')
        this.state = {
            obs: "",
            edit: false,
            isLoading: false
        };
    }

    stateUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    componentDidMount() {

        this.props.navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() =>
                    this.deleteAlert()
                }>
                    <Icon name='trash' style={{ marginRight: 20 }} size={18} color='#FFF' />
                </TouchableOpacity>

        });
        this.stateUpdate(true, 'isLoading')
        this.dbRef.doc(this.props.route.params.id).get().then((res) => {
            if (res.exists) {
                const user = res.data();
                this.setState(
                    this.state = {
                        ...this.state,
                        key: res.id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        cpf: user.cpf,
                        birthday: user.birthday,
                        history: user.history,
                        isLoading: false,
                        edit: false,
                        obs: ""
                    });
            } else {
                this.stateUpdate(false, 'isLoading')
                console.log("Paciente não encontrado!");
            }
        });
    }

    cancel() {
        this.setState(
            this.state = {
                ...this.state,
                obs: "",
                edit: false,
                isLoading: false
            });
    }

    storeProntuario() {

        if (this.state.obs === "") {
            this.createAlert()
        } else {
            this.stateUpdate(true, 'isLoading')
            this.dbRef.doc(this.state.key).set({
                history: firebase.firestore.FieldValue.arrayUnion(
                    {
                        obs: this.state.obs,
                        data: getTime(new Date())
                    }
                )
            }, { merge: true }).then((res) => {
                this.componentDidMount()
            }).catch((err) => {
                console.error("Error found: ", err);
                this.stateUpdate(false, 'isLoading')
            });
        }
    }

    getAge() {
        let idade = differenceInYears(fromUnixTime(this.state.birthday), new Date()) * -1
        return idade === 1 ? idade.toString() + ' ano' : idade.toString() + ' anos'
    }


    deleteItem(i) {
        let history = this.state.history
        let arr = history.slice(history.findIndex(h => parseInt(h.data) === parseInt(i)),1)
        console.log(arr)
        this.stateUpdate(arr, 'history')
        this.displayHistory()
    }


    displayHistory() {
        if (this.state.history && this.state.history.length > 0) {
            return (
                this.state.history.map((l, i) => (
                    <View key={i}>
                        <View style={styles.info}>
                            <View>
                                <Text style={styles.textLabel}>Data:</Text>
                                <Text style={styles.textItem}>{format(fromUnixTime(millisecondsToSeconds(l.data)), 'dd/MM/yyyy HH:mm')}</Text>
                                <View style={styles.divider10}></View>
                                <Text style={styles.textLabel}>Anotação:</Text>
                                <Text style={styles.textItem}>{l.obs}</Text>

                            </View>
                            <View>
                                <TouchableOpacity onPress={() =>
                                    this.deleteItem(l.data)
                                }>
                                    <Icon name='trash' style={{ marginRight: 2 }} size={18} color='#1e3464' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.line}></View>
                    </View>
                ))
            )
        } else {
            return (
                <View>
                    <Text style={styles.textLabel}>Nenhum registro encontrado!</Text>
                </View>
            );
        }
    }
    createAlert() {
        Alert.alert(
            "FisioApp",
            'Insira a informação do prontuário!',
            [{
                text: "Entendi",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            ]
        );
    }

    deleteAlert() {
        Alert.alert(
            "FisioApp",
            'Deseja excluir o paciente?',
            [{
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "Excluir",
                onPress: () => this.deletePaciente(),
            }
            ]
        );
    }

    deletePaciente() {
        this.stateUpdate(true, 'isLoading')
        this.dbRef.doc(this.state.key).delete()
            .then(() => {
                this.props.navigation.navigate('Lista')
            })
    }


    render = () => {

        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            )
        }
        if (!this.state.isLoading && this.state.edit) {
            return (
                <ScrollView style={styles.container}>
                    <Text style={styles.textLabel}>Anotações:</Text>
                    <View style={styles.inputGroup}>
                        <TextInput
                            multiline={true}
                            autoFocus={true}
                            style={styles.formField}
                            value={this.state.obs}
                            onChangeText={(val) => this.stateUpdate(val, 'obs')}
                        />
                    </View>
                    <View style={styles.divider10}></View>
                    <View style={styles.button}>
                        <Button
                            title='Salvar Prontuário'
                            onPress={() => this.storeProntuario()}
                            color="#19AC52"
                        />
                    </View>
                    <View style={styles.divider10}></View>
                    <View style={styles.button}>
                        <Button
                            title='Cancelar'
                            onPress={() => this.cancel()}
                            color="#A9AA52"
                        />
                    </View>
                </ScrollView>
            );
        }

        return (
            <ScrollView>
                <View style={styles.headerList}>
                    <Text style={styles.headerListTitle}>
                        <Icon name='user' size={16} color='#555' /> Informações
                    </Text>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('Paciente', {
                            id: this.state.key
                        })
                    }>
                        <Icon name='edit' size={20} color='#1e3464' />
                    </TouchableOpacity>

                </View>
                <View style={styles.container}>
                    <View style={styles.info}>
                        <View>
                            <Text style={styles.textLabel}>Nome completo:</Text>
                            <Text style={styles.textItem}>{this.state.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.textLabel}>Idade:</Text>
                            <Text style={styles.textItem}>{this.getAge()}</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.headerList}>
                    <Text style={styles.headerListTitle}>
                        <Icon name='history' size={16} color='#555' /> Histórico
                    </Text>
                    <TouchableOpacity onPress={() => this.setState(this.state = { ...this.state, edit: true })}>
                        <Icon name='plus' size={20} color='#1e3464' />
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    {
                        this.displayHistory()
                    }
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
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
    button: {},
    line: {
        height: 10,
        borderBottomColor: '#777',
        borderBottomWidth: 0.2,
        marginBottom: 10
    },
    divider10: {
        height: 10
    },

    formField: {
        padding: 12,
        paddingTop: 12,
        textAlignVertical: 'top',
        height: 200,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#1E3464'
    },

    textLabel: {
        fontSize: 12,
        color: '#555',
        marginBottom: 5
    },
    textItem: {
        fontSize: 16,
        color: '#999',
        fontWeight: '600',
        marginBottom: 5
    },
    headerList: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        paddingTop: 18,
        paddingBottom: 18,
    },
    headerListTitle: {
        fontWeight: '600',
        fontSize: 16
    },
})

export default Prontuario;