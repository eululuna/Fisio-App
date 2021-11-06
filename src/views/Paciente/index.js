import moment from 'moment';
import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import db from './../../../config/Database/firebase'

class Prontuario extends Component {



    constructor() {
        super();
        this.dbRef = db.firestore().collection('paciente')
        this.state = {
            name: "",
            email: "",
            mobile: "",
            cpf: "",
            birthday: "",
            history = "",
            errorMsg = null,
            isLoading: false
        };
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    cancel() {
        this.state = {
            name: null,
            email: null,
            mobile: null,
            cpf: null,
            birthday: null,
            history = null,
            errorMsg = null,
            isLoading: false
        };
        this.props.navigation.pop()
    }

    maskDate(value) {
        let val = value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d)/, "$1");

        this.inputValueUpdate(val, 'birthday')
    };


    validate = () => {
        errorMsg = null
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (this.state.name === '') {
            errorMsg.name = 'Insira o nome.'
        } else if (this.state.name.length < 3) {
            errorMsg.name = 'O nome está muito curto'
        } else if (!reg.test(this.state.email)) {
            errorMsg.email = 'Insira um email válido'
        } else if (this.state.mobile.length < 10 || this.state.mobile.length > 11) {
            errorMsg.mobile = 'Insira o telefone com DDD sem o zero (ex: 54992257145)'
        } else if (this.state.cpf.length !== 11) {
            errorMsg.cpf = 'Insira o CPF com 11 dígitos'
        } else if (moment(this.state.birthday, 'DD/MM/YYYY', true).isValid()) {
            errorMsg.birthday = 'Insira a data de nascimento.'
        }
        return errorMsg
    }

    storePaciente() {
        if (!this.validate()) {
            this.setState({
                isLoading: true,
            })
            this.dbRef.add({
                name: this.state.name,
                email: this.state.email,
                mobile: this.state.mobile,
                cpf: this.state.cpf,
                birthday: this.state.birthday
            }).then((res) => {
                this.state = {
                    isLoading: false
                }
                this.props.navigation.navigate('Home')
            }).catch((err) => {
                console.error("Erro: ", err);
                this.setState({
                    isLoading: false,
                })
            })
        }
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

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder={'Nome completo'}
                    value={this.state.name}
                    onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder={'Email'}
                    keyboardType='email-address'
                    value={this.state.email}
                    onChangeText={(val) => this.inputValueUpdate(val, 'email')}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder={'WhatsApp'}
                    keyboardType='phone-pad'
                    value={this.state.mobile}
                    onChangeText={(val) => this.inputValueUpdate(val, 'mobile')}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder={'Data de nascimento'}
                    keyboardType='phone-pad'
                    value={this.state.birthday}
                    onChangeText={(val) => this.maskDate(val)}
                />
            </View>


            <View style={styles.button}>
                <Button
                    title='Atualizar Prontuário'
                    onPress={() => this.storePaciente()}
                    color="#19AC52"
                />
            </View>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
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
    button: {

    }
})

export default Prontuario;