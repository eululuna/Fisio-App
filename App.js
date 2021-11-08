// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native';

import Agenda from './src/views/Agenda';
import Lista from './src/views/Lista';
import Prontuario from './src/views/Prontuario';
import Paciente from './src/views/Paciente';

import Home from './src/views/Home';

const Stack = createStackNavigator();


function Routes() {
  return (

    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3464',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Agenda"
        component={Agenda}
        options={{
          title: 'Agenda'
        }}
      />

      <Stack.Screen
        name="Lista"
        component={Lista}
        options={({ navigation }) => ({
          title: 'Pacientes',
          headerRight: () => (
            <TouchableOpacity onPress={() =>
              navigation.navigate('Paciente')
            }>
              <Icon name='plus' style={{ marginRight: 20 }} size={20} color='#FFF' />
            </TouchableOpacity>
          )
        })}
      />

      <Stack.Screen
        name="Prontuario"
        component={Prontuario}
        options={{ title: 'Prontuario' }}
      />

      <Stack.Screen
        name="Paciente"
        component={Paciente}
        options={{ title: 'Paciente' }}
      />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}