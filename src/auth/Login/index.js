import React from "react";
import { SafeAreaView, Image, TextInput, View, Text, Button } from "react-native";

import style from "../style"

export default function Login({ navigation }) {
    return (
        <SafeAreaView>
            <View style={style.screen}>
                <View style={style.registerHeader}>
                    <Image style={style.logo}
                        source={require('./../../../assets/logo.png')} />

                    <Text style={style.title}>Faça login para continuar</Text>
                </View>
                <TextInput
                    style={style.input}
                    placeholder="Email"
                    keyboardType="email-address" />

                <TextInput
                    style={style.input}
                    placeholder="Senha"
                    secureTextEntry />

                <Button
                    style={style.btnAction}
                    title="Entrar"
                    onPress={() => { }}
                />
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Cadastrar-se"
                    onPress={() => { }}
                />
            </View>
        </SafeAreaView>
    )
}

