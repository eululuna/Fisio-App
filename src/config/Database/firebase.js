import * as firebase from 'firebase/app'
import "firebase/storage"
import { doc, onSnapshot } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyDnrI4nm7_wUmmWRligO7e_JQsrzV3UJJ4",
    authDomain: "fisioapp-ff247.firebaseapp.com",
    projectId: "fisioapp-ff247",
    storageBucket: "fisioapp-ff247.appspot.com",
    messagingSenderId: "1042310314454",
    appId: "1:1042310314454:web:ef42a60a30b68f773f0c77"
  };
  
 
  const app = initializeApp(firebaseConfig);

  const database = app.database

  export default { database, doc, onSnapshot }
  
  // App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Agendamento from './src/views/pages/paciente/Agendamento';


const Stack = createStackNavigator();

function MyStack() {
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
      <MyStack />
    </NavigationContainer>
  );
}