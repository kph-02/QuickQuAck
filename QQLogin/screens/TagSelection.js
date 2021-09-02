import React, { useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//icons
import { Ionicons } from '@expo/vector-icons';
import {
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  RightIcon,
  Colors,
  ButtonText,
  StyledButton2,
} from './../components/styles';
import { Button, View, Modal, StyleSheet, Text, Dimensions } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';

import MultiSelect from 'react-native-multiple-select';
import { ScrollView } from 'react-native-gesture-handler';

var userId = '';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

//Getting userID from local storage, must exist otherwise user can't be on this page
const getUserId = async () => {
  try {
    await AsyncStorage.getItem('user_id').then((user_id) => {
      // console.log('Retrieved User ID: ' + user_id);
      userId = user_id;
    });
  } catch (error) {
    console.error(error.message);
  }
};

const TagSelection = ({ navigation }) => {
  // Use State hooks
  const [selectedItems, setSelectedItems] = useState([]);
  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    postTag: [] /*Initialize as first value in tags drop-down*/,
    user_id: userId,
  });

  //   var JWTtoken = '';

  //Stores values to update input fields from user
  const { postTag, user_id } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault(); //prevent refresh
    // console.log(postTag);
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.postTag.length != 0) {
      sendToDB(inputs);
      navigation.navigate('Login');
    } else {
      alert('Please select at least one tag.');
    }
  };

  //Getting JWT from local storage, must exist otherwise user can't be on this page
  //   const getJWT = async () => {
  //     try {
  //       await AsyncStorage.getItem('token').then((token) => {
  //         // console.log('Retrieved Token: ' + token);
  //         JWTtoken = token;
  //       });
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  //Send post information created by user to the database
  const sendToDB = async (body) => {
    // await getJWT(); //get Token

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Send post info to DB
      const response = await fetch('http://' + serverIp + '/feed/user-tag-selection', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      // console.log(postTag);
      // console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  const items = [
    //list of items for the select list
    { id: '{Revelle}', name: 'Revelle' },
    { id: '{Muir}', name: 'Muir' },
    { id: '{Marshall}', name: 'Marshall' },
    { id: '{Warren}', name: 'Warren' },
    { id: '{ERC}', name: 'ERC' },
    { id: '{Sixth}', name: 'Sixth' },
    { id: '{Seventh}', name: 'Seventh' },
    { id: '{Question}', name: 'Question' },
    { id: '{Poll}', name: 'Poll' },
    { id: '{Food}', name: 'Food' },
    { id: '{Social}', name: 'Social' },
  ];

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    // if (selectedItems.length > 3) {return}
    setSelectedItems(selectedItems);
    setInputs({ ...inputs, postTag: selectedItems, user_id: userId });
  };

  /* Controls the size of the font in the original post, so that it fits in the View */
  const AdjustLabel = ({ fontSize, text, style, numberOfLines }) => {
    const [currentFont, setCurrentFont] = useState(fontSize);

    return (
      <Text
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit
        style={[style, { fontSize: currentFont }]}
        onTextLayout={(e) => {
          const { lines } = e.nativeEvent;
          if (lines.length > numberOfLines) {
            setCurrentFont(currentFont - 1);
          }
        }}
      >
        {text}
      </Text>
    );
  };

  getUserId();

  return (
    
    <StyledContainer>
      <StatusBar style="black" />
      <AdjustLabel 
        fontSize={40} 
        text="Personalize QuickQuAck" 
        style={{textAlign: 'center', fontWeight: 'bold', color: 'black', padding: 50}} 
        numberOfLines={2}   
      />
      {/* <PageTitle>Personalize QuickQuAck</PageTitle> */}
      <Text style={styles.welcome}>
        Select a few interest tags to get better, more personalized post recommendations on your feed
      </Text>
      <View>
        <MultiSelect
          hideSubmitButton
          items={items}
          uniqueKey="name"
          // onSelectedItemsChange={(selectedItems) => onChange('postTag', selectedItems)} //update inputs to match user input
          // onSelectedItemsChange={console.log(postTag)}
          selectedItems={selectedItems}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItemIconColor={yellow}
          selectedItemTextColor={black}
          tagBorderColor={yellow}
          tagTextColor={black}
          textInputProps={{ editable: false }}
          searchInputPlaceholderText=""
          searchIcon={false}
          fixedHeight={false}
          selectText=""
          styleListContainer={{height: height * 0.22}}
        ></MultiSelect>
      </View>
      <StyledButton2 onPress={onPressButton}>
        <ButtonText>Save</ButtonText>
      </StyledButton2>
    </StyledContainer>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    marginTop: 30,
    marginBottom: 50,
    color: Colors.darkgray,
  },
});

export default TagSelection;
