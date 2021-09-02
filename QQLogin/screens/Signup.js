import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//formik
import { Formik, Field, Form } from 'formik';

//icons

import { Octicons, Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

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

import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

//Using Async Storage to store token JSON object locally as string
const storeUserID = async (value) => {
  try {
    await AsyncStorage.setItem('user_id', value);
    // console.log('Inserted Token:  ' + value);
  } catch (error) {
    // saving error
    console.error(error.message);
  }
};

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [agree, setAgree] = useState(false);

  //communicate registration information with the database
  const sendToDB = async (body) => {
    try {
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      //Sign-Up unsuccessful
      if (!parseRes.user_id) {
        alert(parseRes);
      }
      //Sign-Up successful
      else {
        storeUserID(parseRes.user_id);
        alert('Account Creation Successful!');
        navigation.navigate('TagSelection');
      }

      // possibly add if/else statement to determine if setAuth should be true or false
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="black" />
        <InnerContainer>
          <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={'#BDBDBD'}
              size={40}
              // style={{ alignSelf: 'center', justifyContent: 'center', top: 10, backgroundColor: 'yellow' }}
            />
            </TouchableOpacity>
          <PageTitle>Sign Up</PageTitle>

          <SubTitle></SubTitle>
          <Formik
            // validationSchema={loginValidationSchema}
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
                gy: values.gy,
              };

              sendToDB(body);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values}) => (
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
                  style={{ color: 'black' }}
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
                  style={{ color: 'black' }}
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
                  style={{ color: 'black' }}
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
                  style={{ color: 'black' }}
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
                  style={{ color: 'black' }}
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
                  style={{ color: 'black' }}
                />

                <MsgBox>By clicking Sign Up, you agree to Quick QuAck's Terms & Conditions.</MsgBox>

                <StyledButton onPress={handleSubmit} >
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

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
})


export default Signup;

// import React from 'react'
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   TextInput,
//   Button
// } from 'react-native'
// import { Formik } from 'formik'
// import * as yup from 'yup'

// const loginValidationSchema = yup.object().shape({
//   email: yup
//     .string()
//     .email("Please enter valid email")
//     .required('Email Address is Required'),
//   password: yup
//     .string()
//     .min(8, ({ min }) => `Password must be at least ${min} characters`)
//     .required('Password is required'),
// })

// const App = () => {
//   return (
//     <>
//       <View style={styles.loginContainer}>
//         <Text>Login Screen</Text>
//         <Formik
//           initialValues={{ email: '', password: '' }}
//           onSubmit={values => console.log(values)}
//         >
//           {({ handleChange, handleBlur, handleSubmit, values }) => (
//             <>
//               <Formik
//                 validationSchema={loginValidationSchema}
//                 initialValues={{ email: '', password: '' }}
//                 onSubmit={values => console.log(values)}
//               >
//                 {({
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   values,
//                   errors,
//                   isValid,
//                 }) => (
//                   <>
//                     <TextInput
//                       name="email"
//                       placeholder="Email Address"
//                       style={styles.textInput}
//                       onChangeText={handleChange('email')}
//                       onBlur={handleBlur('email')}
//                       value={values.email}
//                       keyboardType="email-address"
//                     />
//                     {errors.email &&
//                       <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
//                     }
//                     <TextInput
//                       name="password"
//                       placeholder="Password"
//                       style={styles.textInput}
//                       onChangeText={handleChange('password')}
//                       onBlur={handleBlur('password')}
//                       value={values.password}
//                       secureTextEntry
//                     />
//                     {errors.password &&
//                       <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
//                     }
//                     <Button
//                       onPress={handleSubmit}
//                       title="LOGIN"
//                       disabled={!isValid}
//                     />
//                   </>
//                 )}
//               </Formik>
//             </>
//           )}
//         </Formik>
//       </View>
//     </>
//   )
// }

// const styles = StyleSheet.create({

//   loginContainer: {
//     width: '80%',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 10,
//     elevation: 10,
//     backgroundColor: '#e6e6e6'
//   },
//   textInput: {
//     height: 40,
//     width: '100%',
//     margin: 10,
//     backgroundColor: 'white',
//     borderColor: 'gray',
//     borderWidth: StyleSheet.hairlineWidth,
//     borderRadius: 10,
//   },
// })

// export default App