import firebase from "firebase";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyATkd5uUYjJY6lQaLxo0QL5jszWDj6PhFw",
    authDomain: "chatapp-c9dde.firebaseapp.com",
    projectId: "chatapp-c9dde",
    storageBucket: "chatapp-c9dde.appspot.com",
    messagingSenderId: "1030717615607",
    appId: "1:1030717615607:web:1c0010477a60b9c26fd2f2"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
export default db;
import Validate from "./validate";
import Dashboard from "./dashboard";
const { checkUser, createUser, validateUser } = Validate(db);
const { getFriends, addFriends, message } = Dashboard(db);
export { checkUser, createUser, validateUser, getFriends, addFriends, message };
