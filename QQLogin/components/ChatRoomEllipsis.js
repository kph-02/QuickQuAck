import React, {useState, Component} from 'react';  
import {Dimensions, Platform, StyleSheet, Text, Alert} from 'react-native';  
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverIp } from '../screens/Login';
import { NavigationContainer, useNavigation } from '@react-navigation/native';


const {SlideInMenu} = renderers;

var JWTtoken = '';

const ChatRoomEllipsis = ({navigation, chatroom_id, initiator}) => {

  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        JWTtoken = token;
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const revealUser = async (reveal) => {
    await getJWT();

    const body = {
      chatroom_id : chatroom_id,
      initiator : initiator,
      reveal : reveal,
    };

    try{

        const response = await fetch('http://' + serverIp + '/chat/reveal-chat', {
          method: 'PUT',
          headers: {token: JWTtoken, 'Content-type' : 'application/json'},
          body : JSON.stringify(body)
        });

        const parseRes = await response.json();
      }
        catch(err){console.log(err.message)};

  };

  const handleDelete = async (navigation, chatroom_id) => {

    await getJWT();

    //Tell database to delete chatroom
    try{

      const body = {chatroom_id : chatroom_id};

      const response = await fetch("http://" +serverIp + "/chat/delete-chatroom",{
        method: 'DELETE',
        headers: {token: JWTtoken, 'Content-type' : 'application/json'},
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log(JSON.stringify(parseRes));
    }
    catch(err){console.log(err.message)}    

    navigation.navigate('TabNav', { Screen: 'Messages' });
  };

    return (  
    <Menu renderer={SlideInMenu}>

      {/* Slide-in Menu from the bottom is triggered by the Ellipsis (...) button */}
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal" color='#BDBDBD' size={height * 0.035}/>
      </MenuTrigger>

      {/* Three menu options: Send Message, Flag as inappropriate, Block Posts from User */}
      <MenuOptions style={{paddingBottom: 25, paddingTop: 8}}>

        {/* Anonymous Messaging toggle */}
        <MenuOption 
          style={{paddingVertical: 10}}
          onSelect={() => {
            Alert.alert(
              "Turn off anonymous messaging",
              "Would you like to reveal yourself to this user?",
              [
                {text: 'Reveal', onPress: () => revealUser(1)},
                {text: 'Hide', onPress: () => revealUser(0)},
              ]
            );
          }}>
          <Text style={styles.text}>Anonymous messaging</Text>
        </MenuOption>

        {/* Delete the current chatroom */}
        <MenuOption 
        style={{paddingVertical: 10}}
        onSelect={() => {
          Alert.alert(
              "Delete Chat?",
              "Would you like to delete the current chat?",
              [
                {text: 'Yes', onPress: () => handleDelete(navigation, chatroom_id)},
                {text: 'No', onPress: () => console.log("User Pressed No")},
              ]
          );
        }}>
          <Text style={styles.text}>Delete current chat</Text>
        </MenuOption>

        {/* Block Posts from User */}
        <MenuOption 
        style={{paddingVertical: 10}}
        onSelect={() => {
          Alert.alert(
              "Block Posts from User?",
              "Would you like to block posts from this user?",
              [
                {text: 'Yes', onPress: () => console.log("User Pressed Yes")},
                {text: 'No', onPress: () => console.log("User Pressed No")},
              ]
          );
        }}>
          <Text style={styles.text}>Block posts from this user</Text>
        </MenuOption>
      </MenuOptions>
    </Menu> 
    );  
}

  
const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: 'white',  
  },  
  modal: {  
    justifyContent: 'center',  
    alignItems: 'center',   
    // backgroundColor : "#00BCD4",   
    backgroundColor: 'yellow',
    height: '20%' ,  
    width: '80%',  
    borderRadius:10,  
    borderWidth: 1,  
    borderColor: '#fff',    
    marginTop: 80,  
    marginLeft: 40,  
   },  
   text: {  
      marginLeft: 30, 
      color: 'black', 
      fontSize: height * 0.019
   }  
});

export default ChatRoomEllipsis;