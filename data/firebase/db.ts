/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { Note } from "../db/Note";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfC4gcSXFkpMg-rS-k40FoqgDdZKS8CDY",
  authDomain: "noteapp-31e16.firebaseapp.com",
  projectId: "noteapp-31e16",
  storageBucket: "noteapp-31e16.appspot.com",
  messagingSenderId: "828144550903",
  appId: "1:828144550903:web:0f243ffddbe8993c0ee4f2",
  measurementId: "G-5NL8L97DVX"
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







