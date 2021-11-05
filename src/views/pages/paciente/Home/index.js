import React from "react";
import { SafeAreaView, Image, TextInput, View, Text, Button } from "react-native";
import db from './../../../config/Database/firebase'
import style from "./style"

export default function Home({ navigation }) {

    componentDidMount() {
        const { navigation } = this.props;
        const ref = db.firestore().collection('pacientes').doc();
        ref.get().then((doc) => {
            if (doc.exists) {
                const pacientes = doc.data();
                this.setState({
                    key: doc.id,
                    title: board.title,
                    description: board.description,
                    author: board.author,
                    isLoading: false
                });
            } else {
                console.log("No such document!");
            }
        });
    }

    return (
        <SafeAreaView>
            <View style={style.screen}>
                <View style={style.homeHeader}>
                    <Image style={style.logo}
                        source={require('./../../../../assets/logo.png')} />
                </View>
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Paciente"
                    onPress={() => { }}
                />
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Agendamento"
                    onPress={() => { }}
                />
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    title="Prontuário"
                    onPress={() => { }}
                />
                <View style={style.divider}></View>


            </View>
        </SafeAreaView>
    )
}

