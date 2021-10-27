

import React from "react";
import { SafeAreaView, Image, TextInput, View, Text, Button } from "react-native";

import style from "./../style"

export default function Register({ navigation }) {
    return (
        <SafeAreaView>
            <View style={style.screen}>
                <View style={style.loginHeader}>
                    <Image style={style.logo}
                        source={require('./../../assets/logo.png')} />

                    <Text style={style.title}>Crie sua conta!</Text>
                </View>
                <TextInput
                    style={style.input}
                    placeholder="Nome"
                />
                <TextInput
                    style={style.input}
                    placeholder="Email"
                    keyboardType="email-address" />

                <TextInput
                    style={style.input}
                    placeholder="Senha"
                    secureTextEntry />
                <TextInput
                    style={style.input}
                    placeholder="Confirmar Senha"
                    secureTextEntry />
                <Button 
                 style={style.btnAction}
                    title="Cadastro"
                    onPress={() => { }}
                />
            </View>
        </SafeAreaView>
    )
}

