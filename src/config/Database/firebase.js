import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const config = {
  apiKey: "AIzaSyDnrI4nm7_wUmmWRligO7e_JQsrzV3UJJ4",
  authDomain: "fisioapp-ff247.firebaseapp.com",
  projectId: "fisioapp-ff247",
  storageBucket: "fisioapp-ff247.appspot.com",
  messagingSenderId: "1042310314454",
  appId: "1:1042310314454:web:ef42a60a30b68f773f0c77"
};


firebase.initializeApp(config);

firebase.firestore();

export default firebase;