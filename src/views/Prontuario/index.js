import moment from 'moment';
import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import firebase from './../../config/Database/firebase';

class Prontuario extends Component {

    constructor() {
        super();
        this.state = {
            obs: "",
            edit: false,
            isLoading: false
        };
    }

    componentDidMount() {
        const dbRef = firebase.firestore().collection('prontuario').doc('teste')
        dbRef.get().then((res) => {
            if (res.exists) {
                const user = res.data();
                this.setState(
                    this.state = {
                        key: res.id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        cpf: user.cpf,
                        birthday: user.birthday,
                        history: user.history,
                        ...this.state
                    });
            } else {
                console.log("Paciente não encontrado!");
            }
        });
    }


    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    cancel() {
        this.setState(
            this.state = {
                obs: "",
                edit: false,
                isLoading: false
            });
        this.props.navigation.pop()
    }

    storeUser() {

        if (this.state.obs === '' && this.state.edit) {
            alert('Insira a informação do prontuário!')
        } else {
            this.setState(
                this.state = {
                    ...this.state,
                    isLoading: true
                }
            );
            this.dbRef.add({
                history: [
                    {
                        obs: this.state.obs,
                        data: moment().format('x')
                    }
                ]
            }).then((res) => {
                this.cancel()
            }).catch((err) => {
                console.error("Error found: ", err);
                this.setState(
                    this.state = {
                        ...this.state,
                        isLoading: false,
                    }
                );
            });
        }
    }

    render() {
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

                    <View style={styles.inputGroup}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            placeholder={'Observações'}
                            value={this.state.obs}
                            onChangeText={(val) => this.inputValueUpdate(val, 'obs')}
                        />
                    </View>

                    <View style={styles.button}>
                        <Button
                            title='Salvar Prontuário'
                            onPress={() => this.storeProntuario()}
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

        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text>Prontuário</Text>
                </View>

                <View style={styles.button}>
                    <Button
                        title='Atualizar Prontuário'
                        onPress={() => this.setState(this.state = { ...this.state, edit: true })}
                        color="#19AC52"
                    />
                </View>

            </ScrollView>
        );
    }
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
    button: {}
})

export default Prontuario;