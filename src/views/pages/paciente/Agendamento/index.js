import React from "react";
import { SafeAreaView, Image, TextInput, View, Text, Button } from "react-native";
import { PacienteService } from "../../../../config/Service/paciente";

import style from "./style"

export default function Agendamento({ navigation }) {
 const dbService = new PacienteService()
  return (
    <SafeAreaView>
      <View style={style.screen}>
  
                <Button
                    style={style.btnAction}
                    title="Teste"
                    onPress={() => { dbService.readAll() }}
                />
                </View>
    </SafeAreaView>
  );
}
