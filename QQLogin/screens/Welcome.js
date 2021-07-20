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
const Welcome = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };
  const btnHandler = () => {
    alert('pog');
  };

  return (
    <StyledContainer>
      <StatusBar style="black" />
      <InnerContainer>
        {/* <PageLogo resizeMode = 'contain' source={require('./../assets/login.png')} />
         */}
        <PageTitle>WIP Page</PageTitle>

        <SubTitle></SubTitle>
        <Formik
          initialValues={{ toggle: false, checked: [], name: '', email: '', password: '' }}
          onSubmit={(values) => {
            console.log(values);
            navigation.navigate('Signup');
            //   navigation.navigate("Log In");
            //   navigation.navigate("Splash");
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <StyledButton onPress={() => navigation.navigate('Signup')}>
                <ButtonText>Sign Up</ButtonText>
              </StyledButton>
              <StyledButton onPress={() => navigation.navigate('Login')}>
                <ButtonText>Log In</ButtonText>
              </StyledButton>
              <StyledButton onPress={() => navigation.navigate('Splash')}>
                <ButtonText>Splash</ButtonText>
              </StyledButton>
              <StyledButton
                onPress={
                  () =>
                    navigation.navigate('CreatePost') /* Add turnery for if button can be only pressed if JWT exists */
                }
              >
                <ButtonText>Create Post</ButtonText>
              </StyledButton>
              <Line />

              <ExtraView>
                <ExtraText></ExtraText>
                <TextLink></TextLink>
              </ExtraView>
              <ExtraViewRight>
                <TextLink></TextLink>
              </ExtraViewRight>
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Welcome;

// for using storedValue across screens (storedValue stores the token)
// export default class Welcome extends React.component {

//   onLoad = async () => {
//     try {
//       const storedValue = await AsyncStorage.getItem(key);
//       this.setState({ storedValue });
//     } catch (error) {
//       Alert.alert('Error', 'There was an error.')
//     }
//   }
// }
