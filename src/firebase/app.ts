//import firebase from "firebase/app";
import firebase from "firebase/compat/app";
import { credentials } from "./credentials";
export const FirebaseApp: firebase.app.App = firebase.initializeApp(credentials.config);

import "firebase/compat/messaging";
import "firebase/compat/firestore";
import { collection } from "firebase/firestore";

export const messaging = firebase.messaging();

messaging.getToken({
    vapidKey:credentials.messagingConfig.vapidKey
});

const db = firebase.firestore();
const dbNme = "sample-app";

export const usersRef = db.collection(dbNme);
// for query --- fix later  integrate to usersRef
export const usersQuery = collection(db,"sample-app");