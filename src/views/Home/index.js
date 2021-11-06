import React from "react";
import { SafeAreaView, Image, View, Button } from "react-native";

import style from "../../config/Style/style"

export default function Home({ navigation }) {
    return (
        <SafeAreaView>
            <View style={style.screen}>
                <View style={style.homeHeader}>
                    <Image style={style.logo}
                        source={require('./../../assets/logo.png')} />
                </View>
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Agendamento"
                    onPress={() => {
                        navigation.navigate('Agenda')
                    }}
                />
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Prontuário"
                    onPress={() => {
                        navigation.navigate('Prontuario')
                    }}
                />
                <View style={style.divider}></View>

                <Button
                    style={style.btnAction}
                    title="Pacientes"
                    onPress={() => {
                        navigation.navigate('Lista')
                    }}
                />
                <View style={style.divider}></View>

            </View>
        </SafeAreaView>
    )
}

