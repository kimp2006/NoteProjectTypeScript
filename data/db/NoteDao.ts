/* eslint-disable */
import { Note } from "./Note";
import { deleteNote, getDBConnection, getNoteById, getNotes, saveNote } from "./Db";
import { createNotesTable } from "./AppDb";

export class NoteDao {

  async getAll(): Promise<Note[]> {
    return await getNotes(await getDBConnection())
  }

  async getById(id: Number): Promise<Note>{
    return getNoteById(await getDBConnection(), id)
  }

  async insert(note: Note){
    await saveNote(await getDBConnection(), note)
  }

  async delete(id: number) {
    await deleteNote(await getDBConnection(), id)
  }



}
