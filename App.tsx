/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "react-native-gesture-handler";
import React, { ReactElement, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Alert,
  Button, FlatList, Image, Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput, TouchableHighlight, TouchableOpacityComponent,
  useColorScheme,
  View
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import { NoteDao } from "./data/db/NoteDao";
import { Note } from "./data/db/Note";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const dao = new NoteDao();
function NoteCreateView({ route, navigation }) {

  const { id } = route.params;
  const [titleState, setTitle] = useState("");
  const [bodyState, setBody] = useState("");

  if (id >= 0) {
    dao.getById(id).then((note) => {
      setTitle(note.title);
      setBody(note.body);
    });
  }

  function saveOrUpdate(){
    const note = new Note(titleState, bodyState)
    if (id >= 0){
      note.id = id
    }
      return dao.insert(note)

  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.titleInputStyle} placeholder={"Title"} placeholderTextColor={"#8a8a8a"} onChangeText={setTitle}>
        {titleState}
      </TextInput>
      <TextInput style={styles.bodyInputStyle} placeholderTextColor={"#8a8a8a"} multiline placeholder={"Body"} onChangeText={setBody}>
        {bodyState}
      </TextInput>
      <Button
        title={"Create"}
        onPress={() => saveOrUpdate().then(() => navigation.goBack())}
      />
    </View>
  );
}

// @ts-ignore
function NoteListView({ navigation }) {

  const [notes, setNotes] = useState<Note[]>([]);
  dao.getAll().then((data) => {
    setNotes(data);
  });

  const renderItem = ({ item }) =>
    <View>
      <TouchableHighlight onPress={() => navigation.navigate("NoteScreen", { id: item.id })}>
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
      <FloatingButton click={() => navigation.navigate("NoteScreen", { id: -999 })}></FloatingButton>
    </View>
  );
}


type FloatingButtonProps = PropsWithChildren<{click: Function}>
function FloatingButton({click}: FloatingButtonProps){

  return (
    <Pressable style={styles.floatingBtnStyle} onPress={() => click()}>
      <Text>{'Add'}</Text>
    </Pressable>
  )
}


export type RootStackParamList = {
  NotesListScreen: undefined;
  NoteScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

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
    marginBottom: 8,
  },
  bodyInputStyle: {
    height: 300,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    marginBottom: 16
  },
  floatingBtnStyle: {
    display: 'flex',
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
