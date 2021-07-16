import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
  primary: '#FFFFFF',
  yellow: '#FFCC15',
  background: '#DADADA',
  lightgray: '#F6F6F6',
  darkgray: '#BDBDBD',
  black: '#000000',
  shrek: '#C4D300',
  orange: '#FFA500',
};

const { width, height } = Dimensions.get('screen');

const { primary, yellow, background, lightgray, darkgray, black, shrek, orange } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 108px;
  height: 108px;
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const PageTitle = styled.Text`
  font-size: 40px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 70px;
`;
// change this shit to recenter splash

export const PageTitleSplash = styled.Text`
  font-size: 50px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 3px;
  width: 150%;
  margin-vertical: 35%;
  margin-bottom: 10px;

`;

export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;

export const StyledFormArea = styled.View`
  width: 90%;
  align-self: center;
  color: ${shrek};
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${lightgray};
  padding: 15px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${background};
`;

export const StyledInputLabel = styled.Text`
  color: ${black};
  font-size: 13px;
  text-align: left;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  padding: 16px 32px;
  background-color: ${yellow};
  justify-content: center;
  align-items: center;
  margin-vertical: 10px;
  height: 51px;
  border-radius: 100px;

  ${(props) =>
    props.google == true &&
    `
        background-color: ${lightgray};
        flex-direction: row;
        justify-content: center;
    `}
`;

export const ButtonText = styled.Text`
  color: ${black};
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  font-size: 16px;

  ${(props) =>
    props.google == true &&
    `
       padding: 25px;
    `}
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${lightgray};
  margin-vertical: 10px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraViewRight = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  top: -160%;
  right: -33%;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${yellow};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${yellow};
  font-size: 15px;
  font-weight: bold;
`;

const RoundedTouchableOpacitySignIn = styled.TouchableOpacity`
  height: 50px;
  border-radius: 30px;
  width: 340px;
  justify-content: center;
  align-items: center;
  background-color: ${yellow};
  margin-top: 16px;
`;

const RoundedTouchableOpacityLogIn = styled.TouchableOpacity`
  height: 50px;
  border-radius: 30px;
  width: 340px;
  justify-content: center;
  align-items: center;
  background-color: ${lightgray};
  margin-top: 16px;
`;

export const SignInButton = ({ onPress }) => (
  <RoundedTouchableOpacitySignIn onPress={onPress}>
    <ButtonText>Sign Up</ButtonText>
  </RoundedTouchableOpacitySignIn>
);

export const LogInButton = ({ onPress }) => (
  <RoundedTouchableOpacityLogIn onPress={onPress}>
    <ButtonText>Log In</ButtonText>
  </RoundedTouchableOpacityLogIn>
);
