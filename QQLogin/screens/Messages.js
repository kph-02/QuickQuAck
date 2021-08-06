import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {  Button, View, Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
//formik
import { Formik, Field, Form } from 'formik';
//search bar
import { SearchBar } from 'react-native-elements';

//icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledContainer,
  StyledViewPostContainer,
  InnerContainer,
  Colors,
} from './../components/styles';


//Hardcoded Message Data
const messages = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    user: 'Blue Raccoon',
    body: 'This is a sample message from your friendly neighborhood raccoon!',
    color: 'blue',
    time: '6m',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    user: 'Red Monkey',
    body: "I have the power of god and anime on my side!! AHHHHHHHH",
    color: 'red',
    time: '7/1/21',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    user: 'Purple Unicorn',
    body: 'Can I get a waffle? Can I please get a waffle?',
    color: 'purple',
    time: '6/29/21',
  },
  {
    id: '58894a0f-3da1-471f-bd96-145571e29d82',
    user: 'Green Tortoise',
    body: 'I\'m washing myself AND my clothes',
    color: 'green',
    time: '4/20/21',
  },
];

// Function limiting the number of lines and characters shown for text
const AdjustTextPreview = ({style, text}) => {
  return (
    <Text style={style} numberOfLines={1}>
      {text.length <= 53
        ? `${text}`
        : `${text.substring(0, 50)}...`}
    </Text>
  );
};

// Function creating each message room item/box
const Item = ({ item, onPress, backgroundColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor: 'white', paddingVertical: 15}]}>
    <View style={{flexDirection: 'row'}}>
        {/* Colored Circle for each User */}
        <View style={[{justifyContent: 'center', width:50, height: 50, borderRadius: 50/2}, backgroundColor]}/>
        {/* Chat Room Information: User, latest message, date/time sent */}
        <View style={{marginLeft: 10, width: '85%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10}}>
                <Text style={[styles.title]}>{item.user}</Text>
                <Text style={[styles.bodyText, {color: '#BDBDBD'}]}>{item.time}</Text>
            </View>
            {/* Latest Message from User */}
            <AdjustTextPreview style={[styles.bodyText,]} text={item.body}/>
        </View>
        
    </View>
  </TouchableOpacity>
);

const Messages = ({ navigation }) => {
  const [agree, setAgree] = useState(false);
  
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

  //renderItem function
  const renderItem = ({ item }) => {
    // const backgroundColor = item.id === selectedId ? '#FFCC15' : '#FFFFFF';
    const backgroundColor = item.color;

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          navigation.navigate('Chat');
        }}
        backgroundColor={{ backgroundColor }}
      />
    );
  };

  return (
    <StyledViewPostContainer>
      <StatusBar style="black" />

      {/* Container for Upper Portion of the Messages Screen (Title of Screen and Search Bar) */}
      <View style={{alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#DADADA'}}>
        <Text style={styles.pageTitle}>Messages</Text>
        <SearchBar
          placeholder="Search Inbox"
          // onChangeText={this.updateSearch}
          lightTheme="true"
          containerStyle={{
            width: '90%',
            height: height * 0.07,
            alignItems: 'center',
            marginTop: height * 0.025,
            borderRadius: 100,
            backgroundColor: '#F2F2F2',
          }}
          inputContainerStyle={{ borderRadius: 100, height: '100%', width: '100%', backgroundColor: '#F9F9F9' }}
        />
      </View>

      {/* Container for Messages Section (Scrollable) */}
      <View style={{backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={messages}
          keyExtractor={(item) => item.id}
          // extraData={id}
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
    color: 'black'
  },
  bodyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'black'
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