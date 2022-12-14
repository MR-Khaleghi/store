// Import the functions you need from the SDKs you need
import { async } from "@firebase/util";
import { wait } from "@testing-library/user-event/dist/utils";
import { initializeApp } from "firebase/app";

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

import {getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPTx5hYW-8rVEPAcT2O2Bf-9c4G6CqSHU",
  authDomain: "crwn-clothing-db-a7ed1.firebaseapp.com",
  projectId: "crwn-clothing-db-a7ed1",
  storageBucket: "crwn-clothing-db-a7ed1.appspot.com",
  messagingSenderId: "861313435514",
  appId: "1:861313435514:web:a1b65c877b396d0ff4b8c3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth= getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);


export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, ObjectsToAdd) => {
  const collectionRef = collection(db, collectionKey)
  const batch = writeBatch(db);

  ObjectsToAdd.forEach((Object) => {
    const docRef = doc(collectionRef, Object.title.toLowerCase());
    batch.set(docRef, Object);
  });
  await batch.commit();
  console.log('done');
}


export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);
  // console.log('collectionRef',collectionRef);

  // console.log('q',q);

  const querySnapshot = await getDocs(q);
  // console.log('querySnapshot',querySnapshot.docs);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const {title, items} = docSnapshot.data();
    // console.log(docSnapshot.data());
    acc[title.toLowerCase()] = items;
    
    return acc;
  }, {});
  return categoryMap;
}

export const createUserDocumentFromAuth= async (userAuth, additionalInformation={}) => {
  if(!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  // console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  // console.log(userSnapshot);
  // console.log(userSnapshot.exists());

  if(!userSnapshot.exists()) {
    const {displayName,email} = userAuth;
    const createdAt = new Date(); 

    try{
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    }catch(error){
        console.log('error creating user', error.message);
      }
  }
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async(email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword (auth, email, password);
};


export const signInWithEmailAndPass = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
} 

export const signOutUser = async () => await signOut(auth);


export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);
