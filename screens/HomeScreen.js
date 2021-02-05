//rnfes

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import ListItems from '../components/ListItems';
import { auth, db } from '../firebase';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

//Custom styles Home page
const HomeScreen = () => {
  const navigation = useNavigation();

  //Pitch of stats to store new chat
  const [chats, setChats] = useState([]);
  const logOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    });
  };
  const enterChat = (id, chatName) => {
    console.log('Enter', chatName);
    navigation.navigate('Chat', {
      id,
      chatName,
    });
  };
  //taks a snapshot of the chat message in database
  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerStyle: { backgroundColor: '#ffff' },
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={logOutUser} activeOpacity={0.5}>
            {/* Register user  whit your profil picture */}
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => (
        <View
          styles={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginLeft: 20,
            padding: 10,
          }}
        >
          {/* Camrera,write */}
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>

          {/* Navigates to add chat screen */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AddChat')}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          //rerainding a list whit key id and passing in funtion enterChat
          <ListItems
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
