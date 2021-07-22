import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
//formik
import { Formik } from 'formik';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

//IP (WHEN TESTING, CHANGE TO YOUR LOCAL IPV4 ADDRESS)
const serverIp = "192.168.50.115";

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

import { Button, View } from 'react-native';

import KeyboardAvoidingWrapper from '../components/KBWrapper';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

//Communicating with the database to authenticate login
const sendToDB = async (body) => {

  console.log(body);

  try {
    // Update server with user's registration information
    const response = await fetch("http://" + serverIp + ":5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // Token response from database

    //A. Using Async Storage to store token JSON object locally as string
    const storedToken = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('token', jsonValue)
      } catch (error) {
        // saving error
        console.error(error.message);
      }
    };
  }
  catch (error) {

    console.error(error.message);
  }
}

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <StyledContainer>
      {/* //keyboardavoidingwrapper added in, styledcontainer used to be here wrapping the overall thing */}
      {/* <KeyboardAvoidingWrapper> */}
      <StatusBar style="yellow" />
      <InnerContainer>
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

            sendToDB(body);
            navigation.navigate('TabNav', {Screen: 'Feed'});
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
                selectionColor='#FFCC15'
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
                selectionColor='#FFCC15'
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

export default Login;