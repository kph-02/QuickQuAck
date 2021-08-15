import React, { useState, Component, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';
import Poll from '../components/Poll.js';
//formik
import { Formik } from 'formik';
import { Switch } from 'react-native-switch';
//icons

import { Octicons, Ionicons } from '@expo/vector-icons';

import {
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledViewPostContainer,
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
  PageTitleFlag,
} from './../components/styles';
import { Button, View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { TextInput } from 'react-native-gesture-handler';
import Map from '../screens/Map'
//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePost = ({ route, navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const { postType } = route.params;
  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    postText: '',
    postTag: [] /*Initialize as first value in tags drop-down*/,
    num_comments: 0 /*0 comments to begin with, updated when new comments added */,
    num_upvotes: 0,
  });

  var JWTtoken = '';

 
  //Stores values to update input fields from user
  const { postText, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    // console.log(inputs);
  };

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.postText && inputs.postTag.length != 0) {
      sendToDB(postType.post_type, inputs);

      if (postType.post_type === 'Update') {
        navigation.navigate('TabNav', { Screen: 'Feed' });
        alert('Post Updated!');
      } else {
        navigation.pop();
        if (postType.post_type === 'Text') {
          alert('Post Created');
        } else {
          alert('Post not created, poll not setup yet');
        }
      }
    } else {
      alert('Can not submit a post without content or tags!');
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
  const sendToDB = async (type, body) => {
    await getJWT(); //get Token

    if (type === 'Text') {
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
    }

    if (type === 'Update') {
      const updateBody = {
        postText: body.postText,
        post_id: postType.post_id,
      };
      try {
        // console.log('Sent Token:      ' + JWTtoken);
        // Send post info to DB
        const response = await fetch('http://' + serverIp + ':5000/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken, 'content-type': 'application/json' },
          body: JSON.stringify(updateBody),
        });

        const parseRes = await response.json();

        //console.log('UPDATE: ' + JSON.stringify(parseRes));
      } catch (error) {
        console.error(error.message);
      }
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

  useEffect(() => {
    if (postType.post_type === 'Update') {
      onChange('postText', postType.post_text);
    }
  }, []);
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

          {/* Back Button */}
          <TextLink onPress={() => navigation.pop()} style={{marginLeft: 10, width: 55, paddingHorizontal: 5, bottom: 20}}>
              <TextPostContent>Back</TextPostContent>
          </TextLink>

          {/* Page Title with the Post/Update button across from it */}
          <View style={{flexDirection: 'row', marginTop: 35, width: '100%', justifyContent: 'space-between', paddingBottom: 20}}>
            <PageTitleFlag style={{marginLeft: 15, fontSize: 22}}>{postType.post_type === 'Update' ? 'Update Post' : 'New Post'}</PageTitleFlag>
            <TouchableOpacity onPress={onPressButton} style={{marginRight: 15}}>
                <TextPostContent>{postType.post_type === 'Update' ? 'Update' : 'Post'}</TextPostContent>
            </TouchableOpacity>
          </View>

          {/* Section/Container for Anonymous Username */}
          <View style={{backgroundColor: 'white', paddingVertical: 10, borderTopColor: '#DADADA', borderTopWidth: 1, paddingHorizontal: 15}}>
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
            />
          </View>

          {/* Section/Container for Text input for the Post */}
          <View style={{alignItems: 'stretch', backgroundColor: 'white', paddingVertical: 10 , borderTopColor: '#DADADA', borderTopWidth: 1}}>
            <MyTextInput
              placeholder={postType.post_type === 'Text' ? 'Post Text' : 'Poll title'}
              name="postText"
              style={{backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postText', e)} //update inputs to match user input
              value={postText}
              selectionColor="#FFCC15" //implement a max length
              maxLength={250}
              multiline
            />
            <Poll Type={postType.post_type} />
            {/* <Button
            title="test" 
            onPress= {() => console.log(Map.getLocationAsync())} /> */}
          </View>

        {/* <InnerPostContainer> */}
          {/* <ExtraBackView>
            <TextLink onPress={() => navigation.pop()}>
              <TextPostContent>Back</TextPostContent>
            </TextLink>
          </ExtraBackView> */}
          {/* <ExtraPostView style={{backgroundColor: 'yellow'}}>
            <TextLink onPress={onPressButton} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} style={{backgroundColor: 'pink'}}>
              <TextPostContent>{postType.post_type === 'Update' ? 'Update' : 'Post'}</TextPostContent>
            </TextLink>
          </ExtraPostView>
          <PageTitlePost>{postType.post_type === 'Update' ? 'Update Post' : 'New Post'}</PageTitlePost>
          <StyledPostArea1>
            <Line />

            <MyTextInput
              placeholder={postType.post_type === 'Text' ? 'Post Text' : 'Poll title'}
              name="postText"
              style={{}}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postText', e)} //update inputs to match user input
              value={postText}
              selectionColor="#FFCC15" //implement a max length
              maxLength={250}
              multiline={true}
            />

            <Poll Type={postType.post_type} />
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
          />
        </TagDropdown> */}
      </StyledViewPostContainer>
    </Modal>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      {/* <StyledInputLabel> {label} </StyledInputLabel> */}
      <StyledPostInput {...props} style={{maxHeight: 150, padding: 0, marginVertical: 0, borderRadius: 0, marginBottom: 0}}/>
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
