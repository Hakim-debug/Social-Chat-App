import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar } from 'react-native-elements';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../firebase';
import * as firebase from 'firebase';

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  //This keeps trak of the all messages
  const [messages, setMessages] = useState([]);
  console.log(messages);

  //I use UseLayoyt insted for useEffct Because we are depend of the route

  useLayoutEffect(() => {
    //This is were the User typs in the message and send it
    navigation.setOptions({
      title: 'Chat',
      headerTitleAlign: 'left',
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                'https://assets.webiconspng.com/uploads/2017/09/Simpsons-PNG-Image-55525-300x300.png',
            }}
          />
          <Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      //Back Arrow
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      //Create space between camera and phone icon
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white"></Ionicons>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, route.params.chatName]);
  //Saving and adding new chat message and chose how send it in firestore.
  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection('chat').doc(route.params.id).collection('message').add({
      timestap: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput('');
  };
  // Reading from the data base and Setting up a Snapshot listner how shows the last message
  useEffect(() => {
    console.log('rout', route.params.id);
    const unsubscribe = db
      .collection('chat')
      .doc(route.params.id)
      .collection('message')
      .onSnapshot((querySnapshot) => {
        var messageArray = [];
        querySnapshot.forEach((doc) => {
          console.log('doc,data', doc.data());
          messageArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setMessages(messageArray);
      });

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      {/* if the platform is ios the container while style and move out the keybord when typing  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        {/* ReactFragment */}
        <>
          {/* Chat goes here */}
          {/* Render the screen of messages and shows you message*/}
          <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            {messages.map(({ id, data }) =>
              //Seperating a sender and a user
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                  {/* //Shows how sends the messages with your profil picture */}
                  <Avatar
                    position="absolute"
                    rounded
                    //Web
                    containerStyle={{
                      position: 'absolute',
                      bottom: -15,
                      right: -5,
                    }}
                    bottom={-10}
                    right={-5}
                    size={25}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View style={styles.sender}>
                  <Avatar
                    position="absolute"
                    //Web
                    containerStyle={{
                      position: 'absolute',
                      bottom: -15,
                      left: -5,
                    }}
                    bottom={-15}
                    left={-5}
                    rounded
                    size={30}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>
          <View style={styles.footer}>
            {/* Mapping the Chat text input and target a callback of users typeing*/}
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              placeholder="Send message"
              style={styles.textInput}
            />
            {/* Send Button */}
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={24} color="#F00B23" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
//Styling the elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: '#D9E3F0',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    backgroundColor: '#B8E986',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  senderText: {
    color: '#ffff',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
  },
  recieverText: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: '#ffff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
});
