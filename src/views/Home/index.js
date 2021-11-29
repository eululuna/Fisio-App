import React from "react";
import { getYear } from "date-fns";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Image, View } from "react-native";
import { Button } from 'react-native-elements';

import style from "../../config/Style/style"

export default function Home({ navigation }) {
    return (
        <View>
            <View style={style.homeScreen}>
                <View style={style.homeHeader}>
                    <Image style={style.logo}
                        source={require('./../../assets/logo.png')} />
                </View>
                <View style={style.divider}></View>
                <Button
                    style={style.btnAction}
                    icon={<Icon name="calendar" style={{ margin: 10 }} size={20} color="white" />}
                    title="Agenda"
                    onPress={() => {
                        navigation.navigate('Agenda')
                    }}
                />

                <View style={style.divider}></View>


                <Button
                    style={style.btnAction}
                    title="Pacientes"
                    icon={<Icon name="user" style={{ margin: 10 }} size={20} color="white" />}
                    onPress={() => {
                        navigation.navigate('Lista')
                    }}
                />

                <View style={style.divider50}></View>
                <Text style={style.textFooter}>&copy; {getYear(new Date())} FisioApp</Text>

            </View>
        </View>
    )
}

