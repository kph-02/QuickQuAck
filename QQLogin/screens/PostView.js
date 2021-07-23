import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//used for testing, hardcoded token value
var JWTtoken = '';

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
  //communicate registration information with the database

  const sendToDB = async (body) => {
    try {
      const operation = 'update';
      await getJWT();
      if (operation === 'update') {
        // Update server with user's registration information
        const response = await fetch('http://' + serverIp + ':5000/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.text();

        console.log(parseRes);
      }

      if (operation === 'delete') {
        // Update server with user's registration information
        const response = await fetch('http://' + serverIp + ':5000/feed/delete-post', {
          method: 'DELETE',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
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
              postText: '',
              postId: '',
            }}
            onSubmit={(values) => {
              //Setting up information to send to database
              body = {
                postText: 'Title: ' + values.postText + 'Content: ' + values.postTitle,
                postId: values.postId,
              };

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
