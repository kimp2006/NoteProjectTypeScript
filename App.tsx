/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { ReactElement, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Alert,
  Button, FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

const dao = new NoteDao()
type NoteProps = PropsWithChildren<{id: number; title: string; body: string}>;

function NoteCreateView({route, navigation}) {

  const {id} = route.params
  const [titleState, setTitle] = useState("");
  const [bodyState, setBody] = useState("");

  if (id >= 0) {
    dao.getById(id).then((note) => {
      setTitle(note.title)
      setBody(note.body)
    })
  }

  return (
    <View>
      <TextInput placeholder={'Title'} onChangeText={setTitle}>
        {titleState}
      </TextInput>
      <TextInput multiline placeholder={'Body'} onChangeText={setBody}>
        {bodyState}
      </TextInput>
      <Button
        title={'Create'}
        onPress={() => dao.insert(new Note(titleState, bodyState))}
      />
      <Text>{titleState}</Text>
    </View>
  );
}

function NoteListView({navigation}) {

  const [notes, setNotes] = useState<Note[]>([])

  dao.getAll().then((data) => {
    setNotes(data)
  })

  return (
    <Button title={"next"} onPress={() => navigation.navigate('NoteScreen')}/>
  )

}


export type RootStackParamList = {
  NotesListScreen: undefined;
  NoteScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'NotesListScreen'}>
          <Stack.Screen name={'NotesListScreen'} component={NoteListView}/>
          <Stack.Screen name={'NoteScreen'} component={NoteCreateView}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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
    padding: 16
  }
});

export default App;
