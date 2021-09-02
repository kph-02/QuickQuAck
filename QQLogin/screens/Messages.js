import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, View, Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
//formik
import { Formik, Field, Form } from 'formik';
//search bar
import { SearchBar } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

import { serverIp } from './Login.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
//icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import { StyledContainer, StyledViewPostContainer, InnerContainer, Colors } from './../components/styles';

var JWTtoken = '';
var userId = '';

//Hardcoded Message (room) Data
// const messages = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     user: 'Blue Raccoon',
//     body: 'This is a sample message from your friendly neighborhood raccoon!',
//     color: 'blue',
//     time: '6m',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     user: 'Red Monkey',
//     body: 'I have the power of god and anime on my side!! AHHHHHHHH',
//     color: 'red',
//     time: '7/1/21',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d72',
//     user: 'Purple Unicorn',
//     body: 'Can I get a waffle? Can I please get a waffle?',
//     color: 'purple',
//     time: '6/29/21',
//   },
//   {
//     id: '58894a0f-3da1-471f-bd96-145571e29d82',
//     user: 'Green Tortoise',
//     body: "I'm washing myself AND my clothes",
//     color: 'green',
//     time: '4/20/21',
//   },
// ];

// Function limiting the number of lines and characters shown for text
const AdjustTextPreview = ({ style, text }) => {
  return (
    <Text style={style} numberOfLines={1}>
      {text.length <= 53 ? `${text}` : `${text.substring(0, 50)}...`}
    </Text>
  );
};

// Function creating each message room item/box
const Item = ({ item, onPress, backgroundColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor: 'white', paddingVertical: 15 }]}>
    <View style={{ flexDirection: 'row' }}>
      {/* Colored Circle for each User */}
      <View style={[{ justifyContent: 'center', width: 50, height: 50, borderRadius: 50 / 2 }, backgroundColor]} />
      {/* Chat Room Information: User, latest message, date/time sent */}
      <View style={{ marginLeft: 10, width: '85%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10 }}>
          <Text style={[styles.title]}>{getName(item)}</Text>
          <Text style={[styles.bodyText, { color: '#BDBDBD' }]}>{formatTime(item.created_at)}</Text>
        </View>
        {/* Latest Message from User */}
        <AdjustTextPreview style={[styles.bodyText]} text={item.message_preview} />
      </View>
    </View>
  </TouchableOpacity>
);

//Get the right name based on display properties
const getName = (item) => {

  //if the user was the initiator, display recipient name
  if(userId !== item.initiator_id){
    //if initiator chose to reveal, return real name, else return anon name
    if(item.initiator_reveal === '1') {

      return item.initiator_name;
    }
    else{

      return item.initiator_anon_name;
    }
  }
  // get recipient name
  else {
    //if recipient chose to reveal, return real name, else return anon name
    if(item.recipient_reveal === '1') {

      return item.recipient_name;
    }
    else{

      return item.recipient_anon_name;
    }

  }
};

//Format the time to display it nicely
const formatTime = (time) => {
  const segments = time.split('-');

  return segments[1] + '/' + segments[2].substring(0, 2) + '/' + segments[0];
};

const Messages = ({ navigation }) => {
  const [agree, setAgree] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [refreshChats, setRefreshChats] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };
  const btnHandler = () => {
    alert('pog');
  };

  // const updateSearch = (search) => {
  //   setState({search});
  // };

  const [selectedId, setSelectedId] = useState(null);

  //Gets the token from the database
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        //console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

//Get's the user's id from local storage
const getUserID = async () => {
  try {
    await AsyncStorage.getItem('user_id').then((user_id) => {
      //console.log('Retrieved Token: ' + token);
      userId = user_id;
    });
  } catch (error) {
    console.error(error.message);
  }
};

  //renderItem function
  const renderItem = ({ item }) => {
    // const backgroundColor = item.id === selectedId ? '#FFCC15' : '#FFFFFF';
    const backgroundColor = (item.initiator_id !== userId ? item.initiator_color : item.recipient_color).toLowerCase();

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.chatroom_id);
          navigation.navigate('Chat', {
            user: getName(item),
            avatarColor: (item.initiator_id === userId ? item.initiator_color : item.recipient_color).toLowerCase(),
            chatroom_id: item.chatroom_id,
            userId: userId,
            JWTtoken : JWTtoken,
            initiator : item.initiator_id === userId ? true : false,
          });
        }}
        backgroundColor={{ backgroundColor }}
      />
    );
  };

  // Fetch request to get messages from the database and update flatlist
  const getMessages = async () => {
    //get token
    await getJWT();
    await getUserID();

    //Get messages from databse
    try {

      let chats = [];

      const response = await fetch('http://' + serverIp + '/chat/requests-and-chatrooms', {
        method: 'GET',
        headers: { token: JWTtoken, 'Content-type': 'application/json' },
      });

      const parseRes = await response.json();

      if( parseRes.data !== undefined) {
      
        chats = parseRes.data.chatrooms;
        console.log('Chat Messages Refreshed');
      }
      setChatMessages(chats);
      setRefreshChats(!refreshChats);
    } catch (err) {
      console.log(err.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getMessages();
    }, [navigation]),
  );

  return (
    <StyledViewPostContainer>
      <StatusBar style="black" />

      {/* Container for Upper Portion of the Messages Screen (Title of Screen and Search Bar) */}
      <View style={{ alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#DADADA' }}>
        <Text style={styles.pageTitle}>Messages</Text>
        <SearchBar
          placeholder="Search Messages"
          // onChangeText={this.updateSearch}
          lightTheme="true"
          containerStyle={{
            width: '90%',
            height: height * 0.09,
            alignItems: 'center',
            marginTop: height * 0.01,
            borderRadius: 100,
            backgroundColor: '#FFFFFF',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
          }}
          inputContainerStyle={{ borderRadius: 100, height: '100%', width: '100%', backgroundColor: '#F9F9F9' }}
        />
      </View>

      {/* Container for Messages Section (Scrollable) */}
      <View style={{ backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={chatMessages}
          keyExtractor={(item) => item.chatroom_id}
          extraData={refreshChats}
          renderItem={renderItem}
        />
      </View>
    </StyledViewPostContainer>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    // padding: 30,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 1.5,
    //marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  bodyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'black',
  },
  touchableStyle: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  },
});

export default Messages;
