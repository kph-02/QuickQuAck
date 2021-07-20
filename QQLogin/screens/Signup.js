import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
//import { AsyncStorage } from '@react-native-async-storage/async-storage';
=======
import { AsyncStorage } from '@react-native-async-storage/async-storage';
>>>>>>> main

//formik
import { Formik, Field, Form } from 'formik';

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

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [agree, setAgree] = useState(false);

  //communicate registration information with the database
  const sendToDB = async (body) => {

    console.log(body);

    try {
      // Update server with user's registration information
      const response = await fetch("http://" + serverIp + ":5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      // Token response from database

      //A. Using Async Storage to store token JSON object locally as string
      const storedToken = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
<<<<<<< HEAD
          //await AsyncStorage.setItem('token', jsonValue)
=======
          await AsyncStorage.setItem('token', jsonValue)
>>>>>>> main
        } catch (error) {
          // saving error
          console.error(error.message);
        }
      }

      //B. Using Async Storage to get String token 
      //This isn't used in this screen, but it is for future reference

      /*
      const readToken = async () => {
        try {
          const value = await AsyncStorage.getItem('token')
          if(value !== null) {
            // value previously stored
          }
        } catch(e) {
          // error reading value
        }
      }
      */

      // possibly add if/else statement to determine if setAuth should be true or false

    }
    catch (error) {
      console.error(error.message);
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="black" />
        <InnerContainer>
          <PageTitle>Sign Up</PageTitle>

          <SubTitle></SubTitle>
          <Formik
            initialValues={{
              toggle: false,
              checked: [],
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              dob: '',
              college: '',
              gy: '',
            }}
            onSubmit={(values) => {

              //Setting up information to send to database
              body = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                dob: values.dob,
                college: values.college,
                gy: values.gy
              };

              sendToDB(body);
              navigation.navigate('Login');
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                {/* might need to separate name into first and last name, add additional fields */}
                <MyTextInput
                  label=""
                  icon=""
                  placeholder="First Name"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Last Name"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  selectionColor="#FFCC15"
                />

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
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Date of Birth"
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('dob')}
                  onBlur={handleBlur('dob')}
                  value={values.dob}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="College"
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('college')}
                  onBlur={handleBlur('college')}
                  value={values.college}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Graduation Year"
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('gy')}
                  onBlur={handleBlur('gy')}
                  value={values.gy}
                  selectionColor="#FFCC15"
                />

                <MsgBox>By clicking Sign Up, you agree to Quick QuAck's Terms & Conditions.</MsgBox>

                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Sign Up</ButtonText>
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
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkgray} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
