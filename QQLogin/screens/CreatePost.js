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

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePost = ({ navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    //postTitle: '',
    postText: '',
    //author_id: '',
    postTag: 'Revelle' /*Initialize as first value in tags drop-down*/,
    num_comments: 0 /*0 comments to begin with, updated when new comments added */,
  });

  var JWTtoken = '';

  //Stores values to update input fields from user
  //const { postTitle, postText, author_id, postTag } = inputs;
  const { postText, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault();

    if (inputs.postText) {
      sendToDB(inputs);
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

  //communicate registration information with the database
  const sendToDB = async (body) => {
    await getJWT();
    //body.author_id = JWTtoken; //Temp set to JWTtoken, change later maybe?

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
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
          <PageTitlePost>New Post</PageTitlePost>
          <StyledPostArea1>
            {/* <MyTextInput
              placeholder="Post Title"
              name="postTitle"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postTitle', e)}
              value={postTitle}
              selectionColor="#FFCC15"
            /> */}

            <Line />

            <MyTextInput
              placeholder="Post Text"
              name="postText"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postText', e)}
              value={postText}
              selectionColor="#FFCC15"
            />
          </StyledPostArea1>
        </InnerPostContainer>

        <TagDropdown>
          <Picker
            testID="tagdropdown"
            nativeID="tagdropdown"
            mode="dialog"
            prompt="Select a tag"
            name="tagdropdown"
            dropdownIconColor={darkgray}
            selectedValue={postTag}
            onValueChange={(e) => onChange('postTag', e)}
          >
            {/* If first value changes, make sure to change inputs initialization as well */}
            <Picker.Item color={darkgray} label="Revelle" value="Revelle" />
            <Picker.Item color={darkgray} label="Muir" value="Muir" />
            <Picker.Item color={darkgray} label="Marshall" value="Marshall" />
            <Picker.Item color={darkgray} label="Warren" value="Warren" />
            <Picker.Item color={darkgray} label="ERC" value="ERC" />
            <Picker.Item color={darkgray} label="Sixth" value="Sixth" />
            <Picker.Item color={darkgray} label="Seventh" value="Seventh" />
            <Picker.Item color={darkgray} label="Question" value="Question" />
            <Picker.Item color={darkgray} label="Poll" value="Poll" />
            <Picker.Item color={darkgray} label="Food" value="Food" />
            <Picker.Item color={darkgray} label="Social" value="Social" />
          </Picker>
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

export default CreatePost;
