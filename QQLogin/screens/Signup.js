import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

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

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [agree, setAgree] = useState(false);

const sendToDB = async (body) => {

  console.log(body);

  try{
  // Update server with user's registration information
  const response = await fetch("http://192.168.1.51:5000/auth/register", {
    method: "POST", 
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(body)
  });

  const parseRes = await response.json();

  console.log(parseRes);
  
  }
  catch(error){

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
              name: '',
              email: '',
              password: '',
              dateOfBirth: '',
              college: '',
              gradYear: '',
            }}
            onSubmit={(values) => {

              body = {    
              firstName: values.name,
              lastName: values.name,
              email: values.email, 
              password: values.password, 
              dob: values.dateOfBirth,
              college: values.college,
              gy: values.gradYear
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
                  placeholder="Name"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
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
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={values.dateOfBirth}
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
                  onChangeText={handleChange('gradYear')}
                  onBlur={handleBlur('gradYear')}
                  value={values.gradYear}
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
