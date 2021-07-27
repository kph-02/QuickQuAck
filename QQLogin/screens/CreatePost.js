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
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  var JWTtoken = '';

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
  const sendToDB = async (postBody) => {
    await getJWT();
    try {
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody),
      });

      const parseRes = await response.text();

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
            <TextLink onPress={() => navigation.pop()} >
              <TextPostContent>Back</TextPostContent>
            </TextLink>
          </ExtraBackView>
          <ExtraPostView>
            <TextLink onPress={() => navigation.pop()} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
              <TextPostContent>Post</TextPostContent>
            </TextLink>
          </ExtraPostView>

          <PageTitlePost>New Post</PageTitlePost>

          <Formik
            initialValues={{
              postText: '',
              postId: '',
            }}
            onSubmit={(values) => {
              //Setting up information to send to database
              const postBody = {
                postText: values.postText,
                postId: values.postId,
              };
              sendToDB(postBody);
              navigation.navigate('PostView');
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledPostArea1>
                <MyTextInput
<<<<<<< Updated upstream
                  label=""
                  icon=""
=======
                  placeholder="Post Title"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postTitle')}
                  onBlur={handleBlur('postTitle')}
                  value={values.postTitle}
                  selectionColor="#FFCC15"
                />

                <Line />

                <MyTextInput
>>>>>>> Stashed changes
                  placeholder="Post Text"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postText')}
                  onBlur={handleBlur('postText')}
                  value={values.postText}
                  selectionColor="#FFCC15"
                />
<<<<<<< Updated upstream

                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Create Post</ButtonText>
                </StyledButton>
                <StyledButton onPress={() => navigation.navigate('Feed')}>
                  <ButtonText>Back</ButtonText>
                </StyledButton>
                <Line />
              </StyledFormArea>
=======
              </StyledPostArea1>
>>>>>>> Stashed changes
            )}
          </Formik>
        </InnerPostContainer>

        <TagDropdown>
          <Picker
            testID="tagdropdown"
            nativeID="tagdropdown"
            mode="dialog"
            prompt="Select a tag"
            name="tagdropdown"
            dropdownIconColor={darkgray}
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
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
