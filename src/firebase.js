import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBwGB77qVOQy3DaT6acoGBYOOhpA3lXTxA",
    authDomain: "crud-react-77cd5.firebaseapp.com",
    projectId: "crud-react-77cd5",
    storageBucket: "crud-react-77cd5.appspot.com",
    messagingSenderId: "870684959121",
    appId: "1:870684959121:web:ae8ebcc3ad72789a927a30"
  };
  // Initialize Firebase
  app.initializeApp(firebaseConfig);

    const db = app.firestore();
    const auth = app.auth();
    

    export {db, auth};
    