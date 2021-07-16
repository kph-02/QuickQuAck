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

  // const [inputs, setInputs] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  //   dob: "",
  //   college: "",
  //   gy: ""
  // })

  // const { firstName, lastName, email, password, dob, college, gy } = inputs;
  // const onChange = (e) => {
  //   setInputs({...inputs, [e.target.name] : e.target.value })
  // }

  // const onSubmitForm = async e => {
  //   e.preventDefault();
  // }

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
              console.log(values);
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
                  placeholder="college"
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

                <MsgBox></MsgBox>

                <StyledButton onPress={() => navigation.navigate('Welcome')}>
                  <ButtonText>Sign Up</ButtonText>
                </StyledButton>
                <Line />

                <ExtraView>
                  <ExtraText></ExtraText>
                  <TextLink>
                    <TextLinkContent></TextLinkContent>
                  </TextLink>
                </ExtraView>
                <ExtraViewRight>
                  <TextLink>
                    <TextLinkContent></TextLinkContent>
                  </TextLink>
                </ExtraViewRight>
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
