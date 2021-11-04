import React from "react";
import { SafeAreaView, Image, TextInput, View, Text, Button } from "react-native";

import style from "./style"

export default function Home({ navigation }) {
    return (
        <SafeAreaView>
            <View style={style.screen}>
                <View style={style.homeHeader}>
                    <Image style={style.logo}
                        source={require('./../../../assets/logo.png')} />
                </View>
                <Button
                    style={style.btnAction}
                    title="Agendar"
                    onPress={() => { }}
                />
                <Button
                    style={style.btnAction}
                    title="Remarcar"
                    onPress={() => { }}
                />
                <Button
                    style={style.btnAction}
                    title="Ver Anotações"
                    onPress={() => { }}
                />
                <Button
                    style={style.btnAction}
                    title="Lista de Sessões"
                    onPress={() => { }}
                />
            </View>
        </SafeAreaView>
    )
}

