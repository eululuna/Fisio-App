// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Agenda from './src/views/Agenda';
import Lista from './src/views/Lista';
import Prontuario from './src/views/Prontuario';

import Home from './src/views/Home';

const Stack = createStackNavigator();


function NoAuthRoutes() {
  return (
    <Stack.Navigator  >
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Register"
        component={Register}
      />
    </Stack.Navigator>
  );
}


function AuthRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#621FF7',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >

      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Agenda"
        component={Agenda}
        options={{ title: 'Agenda' }}
      />

      <Stack.Screen
        name="Lista"
        component={Lista}
        options={{ title: 'Lista' }}
      />

      <Stack.Screen
        name="Prontuario"
        component={Prontuario}
        options={{ title: 'Prontuario' }}
      />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthRoutes />
    </NavigationContainer>
  );
}