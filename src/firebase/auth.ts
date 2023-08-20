import {FirebaseApp} from "./app";
//import firebase from "firebase/app";
import {getAuth} from "firebase/auth";

export const auth = getAuth(FirebaseApp);