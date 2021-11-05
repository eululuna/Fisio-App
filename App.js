// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Agendamento from './src/views/pages/paciente/Agendamento';
import Login from './src/views/auth/Login';
import Register from './src/views/auth/Register';

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
        name="Agendamento"
        component={Agendamento}
        options={{ title: 'Agendamento' }}
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