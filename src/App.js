import React, {useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
//hello
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
      <header >
      <h1>⚛️🔥💬</h1>
      <SignOut/>
      </header>
      
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

  const dummy = useRef();

  const messageRef = firestore.collection('messages');
  const query =  messageRef.orderBy('createdAt').limit(25);

  const[messages] = useCollectionData(query,{idField:'id'});

  const [formValue , setFormValue] = useState('');
  const sendMessage = async(e)=>{
    e.preventDefault();

    const {uid , photoURL} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');

    dummy.current.scrollIntoView({behavior:'smooth'})
  }
  
  return(<>
  <main>
      <div>
        {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <span ref={dummy}></span>

      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
        <button type="submit">🕊️</button>
      </form>
  
  </>)
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
