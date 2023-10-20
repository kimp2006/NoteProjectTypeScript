/* eslint-disable */
import SQLite from 'react-native-sqlite-storage';
import {Alert} from 'react-native';

const db = SQLite.openDatabase('app_db');

export const createNotesTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      getCreateNotesTableIfNotExistSQLCommand(),
      [],
      result => {
        console.log('Table created successfully');
      },
      error => {
        console.log('CREATE TABLE error', error);
      },
    );
  });
};

export function createNote(note) {
  db.transaction(tx => {
    tx.executeSql(
      getNoteInsertSQLCommand(note.title, note.body),
      [note.title, note.body],
      (transaction, resultSet) => {
        Alert.alert('Success', 'Note added');
      },
      (transaction, error) => {
        Alert.alert('error: ' + error.message);
      },
    );
  });
}

export function getNoteById(id, callBack) {
  db.transaction(tx => {
    tx.executeSql(getByIdSqlCommand(), [id],
      (transaction, resultSet) => {
      Alert.alert(resultSet.rows.item(0))
      callBack(resultSet.rows.item(0));
      });
  });
}

function getNoteInsertSQLCommand() {
  return 'INSERT INTO notes (title, body) values (?, ?)';
}

function getCreateNotesTableIfNotExistSQLCommand() {
  return 'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR, body VARCHAR)';
}

function getAllNotesSQLCommand() {
  return 'SELECT * FROM notes';
}

function getByIdSqlCommand() {
  return 'SELECT * FROM notes WHERE id = ?';
}
