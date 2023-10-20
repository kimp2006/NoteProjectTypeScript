/* eslint-disable */
import { enablePromise, openDatabase, ResultSet, SQLiteDatabase } from "react-native-sqlite-storage";
import {Alert} from 'react-native';
import { Note } from "./Note";

export const getDBConnection = async () => {
  const connection = await openDatabase({ name: 'notes.db'});
  await createTable(connection)
  return connection
};

enablePromise(true);

export const createTable = async (db: SQLiteDatabase)=> {
 await db.executeSql('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR, body VARCHAR)')
}

export const getNotes = async (db: SQLiteDatabase): Promise<Note[]> => {
  try {
    const todoItems: Note[] = [];
    const results = await db.executeSql(`SELECT * FROM notes`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index))
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const getNoteById = async (db: SQLiteDatabase, id: Number) => {
  const query = 'SELECT * FROM notes WHERE id = ?'
  const result = (await db.executeSql(query, [id]))[0]
  return result.rows.item(0) as Note
}
export const saveNote = async (db: SQLiteDatabase, note: Note) => {
  const insertQuery = 'INSERT OR REPLACE INTO notes (title, body)  values (?,?)'
  return db.executeSql(insertQuery, [note.title, note.body]);
};

export const deleteNote = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = 'DELETE from notes where id = ?';
  await db.executeSql(deleteQuery, [id]);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table notes`;
  await db.executeSql(query);
};





