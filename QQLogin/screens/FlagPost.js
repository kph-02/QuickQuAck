import React, { useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MultipleChoice from 'react-native-multiple-choice-picker'; 
//import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {CheckBox} from 'react-native-elements';


//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//formik
import { Formik } from 'formik';

//icons

import {Ionicons } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
  PageLogo,
  PageTitleFlag,
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
import { Button, View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import { Picker } from '@react-native-picker/picker';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const FlagPost = ({ navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const [checkboxState, setCheckboxState] = useState([
   { label: 'Bullying / Harassment', value: 'harassment', checked: false },
   { label: 'Inappropriate Content', value: 'inappropriate', checked: false },
   { label: 'Discrimination / Hate Speech', value: 'hate', checked: false },
   { label: 'Invasion of Privacy', value: 'privacy', checked: false },
   { label: 'Trolling', value: 'trolling', checked: false },
   { label: 'Spam', value: 'spam', checked: false },
   { label: 'Other', value: 'other', checked: false },
 ]);

  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    //postTitle: '',
    postText: '',
    //author_id: '',
    postTag: 'Revelle' /*Initialize as first value in tags drop-down*/,
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

    sendToDB(inputs);
    //not sure if modal will handle this navigation below, try later
    //navigation.navigate('TabNav', { Screen: 'Feed' });
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

  const selectorHandler = (value, index) => {
    const newValue = checkboxState.map((selector, i) => {
      if (i !== index)
        return {
          ...selector,
          checked: false,
        }
      if (i === index) {
        const item = {
          ...selector,
          checked: !selector.checked
        }
        return item
      }
      return selector
    })
    setCheckboxState(newValue);
  }

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop()}
    >
      <StyledViewPostContainer>
        <StatusBar style="black" />
        <TextLink onPress={() => navigation.pop()} style={{marginLeft: 10, width: 55, paddingHorizontal: 5}}>
            <TextPostContent>Back</TextPostContent>
        </TextLink>
        {/* <InnerPostContainer style={{backgroundColor: 'yellow'}}> */}
          {/* <ExtraBackView style={{backgroundColor: 'red'}}> */}
            
          {/* </ExtraBackView> */}
        <View style={{flexDirection: 'row', marginTop: 50, width: '100%', alignContent: 'space-between', paddingBottom: 15}}>
            <PageTitleFlag style={{marginLeft: 15, fontSize: 22}}>Flag as inappropriate?</PageTitleFlag>
            <TouchableOpacity onPress={onPressButton} style={{marginLeft: 115}}>
                <TextPostContent>Flag</TextPostContent>
            </TouchableOpacity>
        </View>
        <View style={{backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1}}>
          <Text style={{marginLeft: 15, color: 'black', fontSize: 14}}>Blue Raccoon</Text>
        </View>
        <View style={{backgroundColor: 'white', paddingVertical: 15 , borderTopColor: '#DADADA', borderTopWidth: 1}}>
          <Text style={{marginLeft: 15, color: 'black', fontSize: 14}}>Who's playing at Sun God today at 7pm?</Text>
        </View>
        <View style={{backgroundColor: '#DADADA', paddingVertical: 15, borderTopColor: '#DADADA'}}>
          <Text style={{marginLeft: 15, color: 'black', fontSize: 14}}>This post falls under:</Text>
        </View>
        {checkboxState.map((selector, i) => (
          <View style={{backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1}} key={i}>
            <CheckBox
              onPress={() => selectorHandler(true, i)}
              title={selector.label}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={selector.checked}
              checkedColor={'#FFCC15'}
              containerStyle={{backgroundColor: 'white', paddingVertical: 14, borderWidth: 0, borderColor: 'white'}}
              textStyle={{color: 'black', fontSize: 14, fontWeight: 'normal'}}
            />
          </View>
        ))}
         <View style={{backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1}}/>
        
        
              {/* <Line style={{backgroundColor: 'black', borderWidth: 3, width: '100%'}}/> */}
          {/* <StyledPostArea1 style={{backgroundColor: 'dodgerblue'}}> */}
            {/* <MyTextInput
              placeholder="Post Title"
              name="postTitle"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postTitle', e)}
              value={postTitle}
              selectionColor="#FFCC15"
            /> */}

            

            {/* <MyTextInput
              placeholder="Post Text"
              name="postText"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postText', e)}
              value={postText}
              selectionColor="#FFCC15"
            />
          </StyledPostArea1> */}
        {/* </InnerPostContainer> */}

        {/* <TagDropdown>
          <Picker
            testID="tagdropdown"
            nativeID="tagdropdown"
            mode="dialog"
            prompt="Select a tag"
            name="tagdropdown"
            dropdownIconColor={darkgray}
            selectedValue={postTag}
            onValueChange={(e) => onChange('postTag', e)}
          > */}
            {/* If first value changes, make sure to change inputs initialization as well */}
            {/* <Picker.Item color={darkgray} label="Revelle" value="Revelle" />
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
        </TagDropdown> */}
      </StyledViewPostContainer>
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

export default FlagPost;
