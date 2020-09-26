import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "chatbot-452c4.firebaseapp.com",
  databaseURL: "https://chatbot-452c4.firebaseio.com",
  projectId: "chatbot-452c4",
  storageBucket: "chatbot-452c4.appspot.com",
  messagingSenderId: "945391478231",
  appId: "1:945391478231:web:fc0bca8cf9283f629d9792",
  measurementId: "G-FSKNQDT6NS"
  
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      <h1>⚛️🔥💬</h1>
        <section>
          {user ? < ChatRoom/> : <SignIn/>}
        </section>

    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const messageRef = firestore.collection('messages');
  const query =  messageRef.orderBy('createdAt').limit(25);

  const[messages] = useCollectionData(query,{idField:'id'});
}

export default App;
