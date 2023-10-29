/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { Note } from "../db/Note";
import firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD87uQ-Ea4DHP4VCPnd1LGQZFlxe-wKsyk",
  authDomain: "noteapp-95fb0.firebaseapp.com",
  projectId: "noteapp-95fb0",
  storageBucket: "noteapp-95fb0.appspot.com",
  messagingSenderId: "1021996082919",
  appId: "1:1021996082919:web:7b9f398ac615f2eb4ba442",
  measurementId: "G-7YDGS1L72X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export class FirebaseNoteDb {
  private firebaseDb = getFirestore(app);
  private NOTES_TABLE = "notes";
  private noteConvertor = {
    toFirestore: (note: Note) => {
      return {
        id: note.id,
        title: note.title,
        body: note.body,
        version: note.version,
        createDate: note.createDate,
        updateDate: note.updateDate,
        isSynchronized: note.isSynchronized
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      const note = new Note(data.title, data.body);
      note.id = data.id;
      note.version = data.version;
      note.createDate = data.createDate;
      note.updateDate = data.updateDate;
      note.isSynchronized = data.isSynchronized;
      return note;
    }
  };

  async getAllNotes() {
    const response = await getDocs(
      collection(this.firebaseDb, this.NOTES_TABLE).withConverter(this.noteConvertor)
    );
    return this.parseToList(response);
  }

  async insertOrUpdate(note: Note) {
    await setDoc(doc(this.firebaseDb, this.NOTES_TABLE, note.id.toString()).withConverter(this.noteConvertor), note);
  }

  async delete(note: Note) {
    await deleteDoc(doc(this.firebaseDb, this.NOTES_TABLE, note.id.toString()));
  }

  private parseToList(response: any): Note[] {
    let result = [];
    for (let i = 0; i < response.docs.length; i++) {
      const note = response.docs[i].data();
      result.push(note);
    }
    return result;
  }
}







