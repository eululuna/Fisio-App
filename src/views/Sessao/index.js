import { fromUnixTime, format, getUnixTime, parseISO } from 'date-fns'
import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Alert } from 'react-native'
import { Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import firebase from './../../config/Database/firebase';
import RNPickerSelect from 'react-native-picker-select/src';


class Sessao extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('agenda')
        this.dbPacientesRef = firebase.firestore().collection('paciente')
        this.state = {
            data: null,
            hora: "",
            paciente: null,
            pacientesArr: [],
            edit: false,
            errorMsg: "",
            isLoading: false
        };
    }

    stateUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    componentDidMount() {
        this.unsubscribe = this.dbPacientesRef.onSnapshot(this.getCollection);

        if (this.props.route.params && this.props.route.params.id) {
            this.stateUpdate(true, 'isLoading')
            this.dbRef.doc(this.props.route.params.id).get().then((res) => {
                if (res.exists) {
                    const agenda = res.data();
                    this.setState(
                        this.state = {
                            ...this.state,
                            key: res.id,
                            data: format(fromUnixTime(agenda.data), 'dd/MM/yyyy'),
                            hora: agenda.hora,
                            paciente: agenda.paciente,
                            isLoading: false,
                            edit: true,
                        });

                    console.log(this.state)
                } else {
                    this.stateUpdate(false, 'isLoading')
                    console.log("Agenda não encontrada!");
                    this.createAlert('Agenda não encontrada')
                }
            });
        }

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getCollection = (querySnapshot) => {
        const pacientesArr = [];
        querySnapshot.forEach((res) => {
            pacientesArr.push({ value: res.id, label: res.data().name });
        })
        this.stateUpdate(pacientesArr, 'pacientesArr')
    }

    cancel() {
        this.setState(
            this.state = {
                ...this.state,
                edit: false,
                isLoading: false
            });
        this.props.navigation.pop()
    }

    maskDate(value) {
        let val = value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d)/, "$1");
        this.stateUpdate(val, 'data')
    }

    maskHora(value) {
        let val = value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1:$2")
        this.stateUpdate(val, 'hora')
    }

    formatDate() {
        let y = this.state.data.split('/')[2]
        let m = this.state.data.split('/')[1]
        let d = this.state.data.split('/')[0]

        let h = this.state.hora
        return parseISO(`${y}-${m}-${d} ${h}`);
    }

    storeAgenda() {

        if (this.state.data !== "" && this.state.hora !== "") {
            let dataSessao = getUnixTime(this.formatDate())
            let dataAtual = getUnixTime(parseISO(format(new Date(), 'yyyy-MM-dd HH:mm')))

            console.log(dataSessao)
            console.log(dataAtual)

            if (dataSessao <= dataAtual) {
                return this.createAlert('Verifique a data e hora do agendamento!')
            }
        }

        if (!this.state.data || this.state.hora === "" || !this.state.paciente) {
            return this.createAlert('Todos os campos são obrigatórios!')

        } else {
            this.stateUpdate(true, 'isLoading')
            this.dbRef.doc(this.state.key).set({
                data: getUnixTime(this.formatDate()),
                hora: this.state.hora,
                paciente: parseInt(this.state.paciente)
            }, { merge: true }).then((res) => {
                //voltar pra tela anterior
                this.props.navigation.pop()
            }).catch((err) => {
                console.error("Error found: ", err);
                this.stateUpdate(false, 'isLoading')
            });
        }
    }

    createAlert(msg) {
        Alert.alert("FisioApp", msg,
            [{
                text: "Entendi",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            ]
        );
    }

    deleteAlert(msg) {
        Alert.alert("FisioApp", msg,
            [{
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "Excluir",
                onPress: () => this.deleteAgenda(),
            }
            ]
        );
    }

    deleteAgenda() {
        this.stateUpdate(true, 'isLoading')
        this.dbRef.doc(this.state.key).delete()
            .then(() => {
                this.props.navigation.pop()
            })
    }

    displayError(prop) {
        if (this.state.errorMsg && this.state.errorMsg[prop]) {
            return (
                <View style={styles.boxError}>
                    <Text style={styles.textError}>
                        <View style={{ marginRight: 5 }}>
                            <Icon name='exclamation-triangle' size={10} color='orange' />
                        </View>
                        {this.state.errorMsg[prop]}
                    </Text>
                </View>
            );
        }
    }

    inputStyle(field) {
        if (this.state.errorMsg && this.state.errorMsg[field]) {
            return {
                ...styles.formField,
                borderColor: 'red'
            }
        }
        return {
            ...styles.formField
        }
    }

    fieldPaciente() {
        if (this.state.edit) {
            return (
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.formField}
                        value={this.state.pacientesArr[this.state.pacientesArr.findIndex(p => p.value === this.state.paciente.toString())].label}
                        editable={false}
                    />
                    {this.displayError('data')}
                </View>
            );
        }
        return (
            <View style={styles.inputGroup}>
                <RNPickerSelect
                    placeholder={{ label: "Selecione um item ..." }}
                    doneText={'Selecionar'}
                    style={this.inputStyle('paciente'), { ...styles.formField }}
                    onValueChange={(value) => this.stateUpdate(value, 'paciente')}
                    items={this.state.pacientesArr}
                />
                {this.displayError('paciente')}
            </View>
        );
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.textLabel}>Data da sessão:</Text>

                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('data')}
                        keyboardType='number-pad'
                        maxLength={10}
                        value={this.state.data}
                        onChangeText={(val) => this.maskDate(val)}
                    />
                    {this.displayError('data')}
                </View>
                <Text style={styles.textLabel}>Hora da sessão:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('hora')}
                        keyboardType='number-pad'
                        maxLength={5}
                        value={this.state.hora}
                        onChangeText={(val) => this.maskHora(val)}
                    />
                    {this.displayError('hora')}
                </View>
                <Text style={styles.textLabel}>Paciente:</Text>
                {
                    this.fieldPaciente()
                }


                <View style={styles.divider10}></View>
                <View style={styles.button}>
                    <Button
                        title='Salvar Agenda'
                        onPress={() => this.storeAgenda()}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
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
        paddingStart: 12,
        height: 40,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#1E3464'
    },
    textLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4
    },
    textItem: {
        fontSize: 16,
        color: '#999',
        fontWeight: '600',
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
    textError: {
        fontSize: 12,
        color: 'red'
    },
    boxError: {
        marginTop: 5,
        display: 'flex',
        alignContent: 'center'
    }
})

export default Sessao;