import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyDbE5L_5t-TL32wQb2Ooqftf38-WuI1OSc",
    authDomain: "slack-app-clone-a4767.firebaseapp.com",
    databaseURL: "https://slack-app-clone-a4767.firebaseio.com",
    projectId: "slack-app-clone-a4767",
    storageBucket: "slack-app-clone-a4767.appspot.com",
    messagingSenderId: "773527897639"
  };

firebase.initializeApp(config);

export default firebase;