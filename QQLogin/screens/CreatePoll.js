import React, { useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//formik
import { Formik } from 'formik';

//icons

import { Octicons, Ionicons } from '@expo/vector-icons';

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
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
  StyledPostArea,
  StyledPostInput,
  PageTitlePost,
  InnerPostContainer,
  ExtraPostView,
  TextPostContent,
  ExtraBackView,
  TagDropdown,
  StyledPostArea1,
  StyledPostArea2,
} from './../components/styles';
import { Button, View, Modal, StyleSheet } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { TextInput } from 'react-native-gesture-handler';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePoll = ({ navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    pollQuestion: '',
    postTag: [] /*Initialize as first value in tags drop-down*/,
    num_comments: 0 /*0 comments to begin with, updated when new comments added */,
  });

  var JWTtoken = '';

  //Stores values to update input fields from user
  const { pollQuestion, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string (name='pollQuestion',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    //console.log(inputs);
  };

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault(); //prevent refresh

    //Check if the post has content, if not, prevent submission and notify
    if (inputs.pollQuestion) {
      // sendToDB(inputs);
      alert('Page not complete, so no post submitted');
      navigation.navigate('TabNav', { Screen: 'Feed' });
    } else {
      alert('Can not submit an empty post!');
    }
  };

  //Getting JWT from local storage, must exist otherwise user can't be on this page
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        // console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //Send post information created by user to the database
  const sendToDB = async (body) => {
    await getJWT(); //get Token

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Send post info to DB
      const response = await fetch('http://' + serverIp + ':5000/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
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

  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    if (selectedItems.length > 3) {
      return;
    }
    setSelectedItems(selectedItems);
    setInputs({ ...inputs, postTag: selectedItems });
  };

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop()}
    >
      <StyledContainer>
        <StatusBar style="black" />
        <InnerPostContainer>
          <ExtraBackView>
            <TextLink onPress={() => navigation.pop()}>
              <TextPostContent>Back</TextPostContent>
            </TextLink>
          </ExtraBackView>
          <ExtraPostView>
            <TextLink onPress={onPressButton} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
              <TextPostContent>Post</TextPostContent>
            </TextLink>
          </ExtraPostView>
          <PageTitlePost>New Poll</PageTitlePost>
          <StyledPostArea1>
            <Line />

            <MyTextInput
              placeholder="Poll Question"
              name="pollQuestion"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('pollQuestion', e)} //update inputs to match user input
              value={pollQuestion}
              selectionColor="#FFCC15" //implement a max length
              maxLength={250}
              multiline={true}
            />

            <MyTextInput
              placeholder="Poll Question"
              name="pollQuestion"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('pollQuestion', e)} //update inputs to match user input
              value={pollQuestion}
              selectionColor="#FFCC15" //implement a max length
              maxLength={250}
              multiline={true}
            />
          </StyledPostArea1>
        </InnerPostContainer>

        <TagDropdown>
          <MultiSelect
            hideSubmitButton
            items={items}
            uniqueKey="name"
            // onSelectedItemsChange={(selectedItems) => onChange('postTag', selectedItems)} //update inputs to match user input
            // onSelectedItemsChange={console.log(postTag)}

            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            // onToggleList = {console.log(moo)}
            selectedItemIconColor={yellow}
            selectedItemTextColor={black}
            tagBorderColor={yellow}
            tagTextColor={black}
            textInputProps={{ editable: false }}
            searchInputPlaceholderText=""
            searchIcon={false}
          ></MultiSelect>
        </TagDropdown>
      </StyledContainer>
    </Modal>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledPostInput {...props} />
      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkgray} />
        </RightIcon>
      )}
    </View>
  );
};

export default CreatePoll;
