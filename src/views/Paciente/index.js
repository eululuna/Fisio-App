import React, { Component } from 'react';
import { isValid, parseISO, format, fromUnixTime, getUnixTime, getTime } from 'date-fns'
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from './../../config/Database/firebase'

class Paciente extends Component {

    constructor() {
        super();
        this.dbRef = firebase.firestore().collection('paciente')
        this.state = {
            id: null,
            name: "",
            email: "",
            mobile: "",
            cpf: "",
            birthday: "",
            history: "",
            errorMsg: null,
            edit: false,
            isLoading: false
        };
    }

    componentDidMount() {

        if (this.props.route.params && this.props.route.params.id) {
            this.stateUpdate(true, 'isLoading')
            this.dbRef.doc(this.props.route.params.id).get().then((res) => {
                if (res.exists) {
                    const user = res.data();
                    this.setState(
                        this.state = {
                            ...this.state,
                            id: res.id,
                            name: user.name,
                            email: user.email,
                            mobile: user.mobile,
                            cpf: user.cpf,
                            birthday: format(fromUnixTime(user.birthday), 'dd/MM/yyyy'),
                            history: user.history,
                            isLoading: false,
                            edit: true,
                            obs: ""
                        });
                } else {
                    this.stateUpdate(false, 'isLoading')
                    console.log("Paciente não encontrado!");
                }
            });
        }

    }

    stateUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    cancel() {
        this.setState(
            this.state = {
                ...this.state,
                edit: false,
                errorMsg: null,
                isLoading: false
            });
        this.props.navigation.navigate('Lista')
    }

    maskDate(value) {
        let val = value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d)/, "$1");

        this.stateUpdate(val, 'birthday')
    }

    maskCPF(value) {
        let val = value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");

        this.stateUpdate(val, 'cpf')
    };

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

    validate() {
        this.stateUpdate(null, 'errorMsg')
        let err = {}
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (this.state.name === "") {
            err.name = 'Insira o nome.'
        } if (this.state.name !== "" && this.state.name.length < 3) {
            err.name = 'O nome está muito curto'
        } if (!reg.test(this.state.email)) {
            err.email = 'Insira um email válido'
        } if (this.state.mobile.length < 10 || this.state.mobile.length > 11) {
            err.mobile = 'Insira o telefone com DDD sem o zero (ex: 54992257145)'
        } if (this.state.cpf.length !== 14) {
            err.cpf = 'Insira o CPF com 11 dígitos'
        }

        let y = this.state.birthday.split('/')[2]
        let m = this.state.birthday.split('/')[1]
        let d = this.state.birthday.split('/')[0]

        if (!isValid(this.formatDate())) {
            err.birthday = 'Insira uma data de nascimento válida'
        }
        this.stateUpdate(!!Object.keys(err).length ? err : null, 'errorMsg');
        if (!!Object.keys(err).length) {
            this.createAlert(this.state.errorMsg)
        }
        return this.state.errorMsg

    }

    formatDate() {
        let y = this.state.birthday.split('/')[2]
        let m = this.state.birthday.split('/')[1]
        let d = this.state.birthday.split('/')[0]
        return parseISO(`${y}-${m}-${d}`)
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

    createAlert() {
        Alert.alert(
            "FisioApp",
            'Verifique os dados informados e tente novamente!',
            [{
                text: "Entendi",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            ]
        );
    }

    storePaciente = () => {
        if (!this.validate()) {
            this.stateUpdate(true, 'isLoading')
            const id = this.state.edit ? this.state.id : getTime(new Date()).toString()
            this.dbRef.doc(id).set({
                name: this.state.name.trim(),
                email: this.state.email.toLowerCase().trim(),
                mobile: this.state.mobile.trim(),
                cpf: this.state.cpf.trim(),
                birthday: getUnixTime(this.formatDate()),
            }).then((res) => {
               // this.cancel()
               this.props.navigation.navigate('Lista')
            }).catch((err) => {
                console.error("Erro: ", err);
                this.stateUpdate(false, 'isLoading')
            })
            return
        }
    }


    render = () => {

        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#1E3464" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.textLabel}>Nome completo:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        autoFocus={true}
                        style={this.inputStyle('name')}
                        value={this.state.name}
                        onChangeText={(val) => this.stateUpdate(val, 'name')}
                    />
                    {this.displayError('name')}
                </View>
                <Text style={styles.textLabel}>Email:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('email')}
                        keyboardType='email-address'
                        value={this.state.email}
                        onChangeText={(val) => this.stateUpdate(val, 'email')}
                    />
                    {this.displayError('email')}
                </View>
                <Text style={styles.textLabel}>WhatsApp:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('mobile')}
                        keyboardType='phone-pad'
                        maxLength={11}
                        value={this.state.mobile}
                        onChangeText={(val) => this.stateUpdate(val, 'mobile')}
                    />
                    {this.displayError('mobile')}
                </View>
                <Text style={styles.textLabel}>CPF:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('cpf')}
                        keyboardType='number-pad'
                        maxLength={14}
                        value={this.state.cpf}
                        onChangeText={(val) => this.maskCPF(val)}
                    />
                    {this.displayError('cpf')}
                </View>
                <Text style={styles.textLabel}>Data de nascimento:</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={this.inputStyle('birthday')}
                        keyboardType='number-pad'
                        maxLength={10}
                        value={this.state.birthday}
                        onChangeText={(val) => this.maskDate(val)}
                    />
                    {this.displayError('birthday')}
                </View>

                <View style={styles.button}>
                    <Button
                        title='Salvar Dados'
                        onPress={() => this.storePaciente()}
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
                <View style={styles.divider10}></View>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 10
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
    formField: {
        paddingStart: 12,
        height: 40,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#1E3464'
    },
    line: {
        height: 20,
        borderBottomColor: '#777',
        borderBottomWidth: 0.2,
    },
    divider10: {
        height: 10
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

export default Paciente;