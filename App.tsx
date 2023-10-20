/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
import { createTable, getDBConnection } from "./data/db/Db";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const dao = new NoteDao()
type NoteProps = PropsWithChildren<{id: number; title: string; body: string}>;

function NoteCreateView({ id, title, body }: NoteProps): ReactElement {

  const [titleState, setTitle] = useState(title);
  const [bodyState, setBody] = useState(body);

  return (
    <View>
      <TextInput placeholder={'Title'} onChangeText={setTitle}>
        {titleState}
      </TextInput>
      <TextInput multiline placeholder={'Body'} onChangeText={setBody}>
        {body}
      </TextInput>
      <Button
        title={'Create'}
        onPress={() => dao.insert(new Note(titleState, bodyState))}
      />
      <Text>{titleState}</Text>
    </View>
  );
}

function NoteListView(): ReactElement {

  const [notes, setNotes] = useState<Note[]>([])

  dao.getAll().then((data) => {
    setNotes(data)
  })

  return (
    <FlatList data={notes} renderItem={({item})=> <Text>{item.body}</Text>}/>
  )

}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NoteListView/>
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
