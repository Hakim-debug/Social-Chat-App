import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

//Making the Chat list items rounde avtars
const ListItems = ({ id, chatName, enterChat }) => {
  // const navigation = useNavigation();
  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            'https://www.seekpng.com/png/full/73-730482_existing-user-default-avatar.png',
        }}
      />
      {/* List */}
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          ABC
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ListItems;

const styles = StyleSheet.create({});
