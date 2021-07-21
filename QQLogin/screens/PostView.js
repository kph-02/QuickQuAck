import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//used for testing, hardcoded token value
const JWTtoken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiOTk5NzhiZWMtNTgzYy00NWRjLWIyMTctMzZlM2VkZDI0NDJhIiwiaWF0IjoxNjI2ODM2NDgxLCJleHAiOjE2MjY4NDAwODF9.niHF6UU4mOA1p3wypRf52MrWfyWYsPxdQZMT2Dqse7U';

//formik
import { Formik, Field, Form } from 'formik';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  RightIcon,
  Colors,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
} from './../components/styles';

import { Button, View } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const PostView = ({ navigation }) => {
  /*Getting JWT from local storage, must exist otherwise user can't be on this page
  *****Local storage still needs to be set up*********
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        console.log(token);
        return token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  */
  //communicate registration information with the database

  const sendToDB = async (body) => {
    try {
      if (operation === 'update') {
        // Update server with user's registration information
        const response = await fetch('http://' + serverIp + ':5000/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken },
          body: JSON.stringify(body),
        });

        const parseRes = await response.text();

        console.log(parseRes);
      }

      if (operation === 'delete') {
        // Update server with user's registration information
        const response = await fetch('http://' + serverIp + ':5000/feed/delete-post', {
          method: 'DELETE',
          headers: { token: JWTtoken },
          body: JSON.stringify(body),
        });

        const parseRes = await response.text();

        console.log(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="black" />
        <InnerContainer>
          <PageTitle>Post View</PageTitle>

          <SubTitle></SubTitle>
          <Formik
            initialValues={{
              operation: '',
              token: '', //hardcoded for now
              postTitle: '', //using for postId for now
              postText: '',
              postId: '',
            }}
            onSubmit={(values) => {
              //Setting up information to send to database
              body = {
                operation: '',
                token: JSON.stringify(JWTtoken),
                postText: 'Title: ' + values.postText + 'Content: ' + values.postTitle,
                postId: values.postId,
              };

              console.log('operate: ' + operation);
              sendToDB(body);
              navigation.navigate('CreatePost');
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Title"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postTitle')}
                  onBlur={handleBlur('postTitle')}
                  value={values.postTitle}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Text"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postText')}
                  onBlur={handleBlur('postText')}
                  value={values.postText}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Id"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postId')}
                  onBlur={handleBlur('postId')}
                  value={values.postId}
                  selectionColor="#FFCC15"
                />

                <StyledButton onPress={((event) => setOpt(event, UPDATE), handleSubmit)}>
                  <ButtonText>Update Post</ButtonText>
                </StyledButton>
                <StyledButton onPress={() => navigation.navigate('CreatePost')}>
                  <ButtonText>Back</ButtonText>
                </StyledButton>
                <StyledButton onPress={((event) => setOpt(event, DELETE), handleSubmit)}>
                  <ButtonText>Delete Post</ButtonText>
                </StyledButton>
                <Line />
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledTextInput {...props} />
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

export default PostView;
