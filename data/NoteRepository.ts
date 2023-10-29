/* eslint-disable */
import { NoteDao } from "./db/NoteDao";
import { Note } from "./db/Note";
import { FirebaseNoteDb } from "./firebase/db";

export class NoteRepository {

  private _noteDao: NoteDao;
  private _firebase: FirebaseNoteDb;

  constructor(noteDao: NoteDao, firebase: FirebaseNoteDb) {
    this._noteDao = noteDao;
    this._firebase = firebase;
  }

  async synchronized() {
    const notes = await this._noteDao.getAll();
    for (let i = 0; i < notes.length - 1; i++) {
      if (notes[i].isDeleted) {
        await this._firebase.delete(notes[i]);
        await this._noteDao.delete(notes[i]);
      } else {
        if (!notes[i].isSynchronized) {
          await this._firebase.insertOrUpdate(notes[i]);
        }
      }
    }
  }

  getAll() {
    try {
      return this._firebase.getAllNotes();
    } catch (e) {
      return this._noteDao.getAll();
    }
  }

  async insertOrUpdate(note: Note) {
    try {
      if (note.id === -1) {
        note.id = Date.now();
      }
      await this._noteDao.insert(note);
      await this._firebase.insertOrUpdate(note);
      return note;
    } catch (e) {
      note.changeSyncStatus();
      throw Error("Save local");
    } finally {

    }
  }

  async delete(note: Note) {
    try {
      await this._firebase.delete(note);
      await this._noteDao.delete(note);
    } catch (e) {
      note.isDeleted = true;
      await this._noteDao.insert(note);
      throw Error("Save local");
    }

  }

}
