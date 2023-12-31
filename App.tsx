/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "react-native-gesture-handler";
import type { PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";

import { NoteDao } from "./data/db/NoteDao";
import { Note } from "./data/db/Note";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NoteRepository } from "./data/NoteRepository";
import { FirebaseNoteDb } from "./data/firebase/db";


const repository = new NoteRepository(new NoteDao(), new FirebaseNoteDb());

// note create and edit screen
function NoteCreateView({ route, navigation }) {

  const { note } = route.params;
  const [titleState, setTitle] = useState(note.title);
  const [bodyState, setBody] = useState(note.body);

  function save() {
    note.title = titleState;
    note.body = bodyState;
    return repository.insertOrUpdate(note);
  }


  return (
    <View style={styles.container}>
      <TextInput style={styles.titleInputStyle} placeholder={"Title"} placeholderTextColor={"#8a8a8a"}
                 value={titleState} onChangeText={setTitle} />
      <TextInput style={styles.bodyInputStyle} placeholderTextColor={"#8a8a8a"} multiline placeholder={"Body"}
                 value={bodyState} onChangeText={setBody} />
      <Button
        title={"Create"}
        onPress={() => save()
          .catch((e) => Alert.alert("Server error", e))
          .finally(() => navigation.goBack())}
      />
      <View style={{ margin: 10 }}></View>
      <Button
        title={"Delete"}
        onPress={() => repository.delete(note)
          .catch((e) => Alert.alert("Server error", e))
          .finally(() => navigation.goBack())}
      />
    </View>
  );
}

// @ts-ignore
function NoteListView({ navigation }) {

  const [notes, setNotes] = useState<Note[]>([]);

  repository.getAll()
    .then((data) => {
      setNotes(data);
    })
    .catch(e => {
      Alert.alert("Unknown error");
    });

  const renderItem = ({ item }) =>
    <View>
      <TouchableHighlight onPress={() => navigation.navigate("NoteScreen", { note: item })}>
        <View style={styles.noteItemStyle}>
          <Text style={styles.tittleStyle}>{item.title}</Text>
          <Text style={styles.bodyStyle}>{item.body}</Text>
        </View>
      </TouchableHighlight>
    </View>;

  const key = (item) => {
    item.id;
  };

  return (
    <View style={styles.container}>
      <FlatList data={notes} renderItem={renderItem} keyExtractor={key} />
      <FloatingButton click={() => navigation.navigate("NoteScreen", { note: new Note("", "") })}></FloatingButton>
    </View>
  );
}


type FloatingButtonProps = PropsWithChildren<{ click: Function }>

function FloatingButton({ click }: FloatingButtonProps) {

  return (
    <Pressable style={styles.floatingBtnStyle} onPress={() => click()}>
      <Text>{"Add"}</Text>
    </Pressable>
  );
}


export type RootStackParamList = {
  NotesListScreen: undefined;
  NoteScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {

  useEffect(() => {
    repository.synchronized()
      .then(() => {

      })
      .catch((e) => {

      });
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"NotesListScreen"}>
        <Stack.Screen name={"NotesListScreen"} component={NoteListView} />
        <Stack.Screen name={"NoteScreen"} component={NoteCreateView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600"
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400"
  },
  highlight: {
    fontWeight: "700"
  },
  container: {
    padding: 16,
    flex: 1
  },
  tittleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#000000"
  },
  bodyStyle: {
    color: "#000000"

  },
  noteItemStyle: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#d0d0d0"
  },
  titleInputStyle: {
    color: "#000000",
    backgroundColor: "#ffffff",
    marginBottom: 8
  },
  bodyInputStyle: {
    height: 300,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    marginBottom: 16
  },
  floatingBtnStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 100,
    width: 64,
    height: 64,
    backgroundColor: "#1a67a4"
  }
});

export default App;
