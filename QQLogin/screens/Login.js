import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
//formik
import { Formik } from 'formik';

//local storage

//icons

import { Octicons, Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

//IP (WHEN TESTING, CHANGE TO YOUR LOCAL IPV4 ADDRESS)
// const serverIp = '100.115.35.200:5000';
// const serverIp = '192.168.0.153:5000';
// const serverIp = '192.168.50.115:5000';
// const serverIp = '192.168.0.114:5000';
// const serverIp = '100.83.38.217:5000';
// const serverIp = '10.128.124.246:5000';
const serverIp = '132.249.242.71'; //Ip for the server :)

import {
  StyledContainer,
  InnerContainer,
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
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
} from './../components/styles';

import { Button, View, StyleSheet, TouchableOpacity } from 'react-native';

import KeyboardAvoidingWrapper from '../components/KBWrapper';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

var JWTtoken = '';

//Using Async Storage to store token JSON object locally as string
const storeToken = async (value) => {
  try {
    await AsyncStorage.setItem('token', value);
    // console.log('Inserted Value:  ' + value);
  } catch (error) {
    // saving error
    console.error(error.message);
  }
};

//Using Async Storage to store token JSON object locally as string
const storeUserID = async (value) => {
  try {
    await AsyncStorage.setItem('user_id', value);
    // console.log('Inserted Value:  ' + value);
  } catch (error) {
    // saving error
    console.error(error.message);
  }
};

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  //Communicating with the database to authenticate login
  const sendToDB = async (body) => {
    try {
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      //Invalid input, display message from server
      if (!parseRes.token) {
        alert(parseRes + ' Please try again.');
        storeToken('');
        storeUserID('');
      }

      //Valid input, continue to feed
      else {
        storeToken(parseRes.token);
        storeUserID(parseRes.user_id);
        navigation.navigate('TabNav', { Screen: 'Feed' });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Everytime the user navigates to this page, authentication will be removed
  // By adding an empty string in local storage for token
  useFocusEffect(
    React.useCallback(() => {
      storeToken('');
      console.log('Cleared Authentication');
    }, [navigation]),
  );

  return (
    <StyledContainer>
      {/* //keyboardavoidingwrapper added in, styledcontainer used to be here wrapping the overall thing */}
      {/* <KeyboardAvoidingWrapper> */}
      <StatusBar style="yellow" />
      <InnerContainer>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={'#BDBDBD'}
              size={40}
              // style={{ alignSelf: 'center', justifyContent: 'center', top: 10, backgroundColor: 'yellow' }}
            />
        </TouchableOpacity>
        {/* removed/commented InnerContainer, attempted to move into KBWrapper */}
        <PageTitle>Log In</PageTitle>

        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => {
            //send values to database on submit
            body = {
              email: values.email,
              password: values.password,
            };

            //Reset text fields
            values.email = '';
            values.password = '';

            sendToDB(body);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTextInput
                label=""
                icon=""
                placeholder="Institution Email"
                placeholderTextColor={darkgray}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                selectionColor="#FFCC15"
                autoCapitalize="none"
                style={{ color: 'black' }}
              />

              <MyTextInput
                label=""
                icon=""
                placeholder="Password"
                placeholderTextColor={darkgray}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
                selectionColor="#FFCC15"
                autoCapitalize="none"
                style={{ color: 'black' }}
              />
              <MsgBox></MsgBox>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Log In</ButtonText>
              </StyledButton>
              <StyledButton google={true} onPress={handleSubmit}>
                <Fontisto name="google" color={primary} size={25} />
                <ButtonText google={true}>Log in with Google</ButtonText>
              </StyledButton>
              <ExtraView>
                <TextLink onPress={() => navigation.navigate('Signup')}>
                  <TextLinkContent>Forgot Your Password?</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
      {/* </KeyboardAvoidingWrapper> */}
    </StyledContainer>
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

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
})

export default Login;
//testing purposes, so don't have to redefine across multiple files
export { serverIp };
