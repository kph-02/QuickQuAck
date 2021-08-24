import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from '../screens/Login.js';

//icons

import { Ionicons } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
  PageTitleFlag,
  StyledInputLabel,
  RightIcon,
  Colors,
  TextLink,
  StyledPostInput,
  TextPostContent,
} from './../components/styles';
import {
  Button,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const ReportModal = ({ route, navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  const { post, user } = route.params;

  //Getting user input
  const [inputs, setInputs] = useState({
    reportText: '',
  });

  var JWTtoken = '';

  //Stores values to update input fields from user
  //const { postTitle, postText, author_id, postTag } = inputs;
  const { reportText } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  //Executes when Submit is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault();
    // sendToDB(inputs);
    navigation.pop(2);
  };



  //Getting JWT from local storage, must exist otherwise user can't be on this page
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        // console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //communicate registration information with the database
  const sendToDB = async (body) => {
    await getJWT();
    //body.author_id = JWTtoken; //Temp set to JWTtoken, change later maybe?

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + '/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop(2)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <StyledViewPostContainer>
          <StatusBar style="black" />

          {/* Back Button */}
          {/* Using navigation.pop(2) for now, because popping back to the FlagPost modal causes issues */}
          <TextLink onPress={() => setModalOpen(false)} style={{ marginLeft: 10, width: 55, paddingHorizontal: 5 }}>
            <TextPostContent>Back</TextPostContent>
          </TextLink>

          {/* Flag as Inappropriate Title, with the Flag button across from it */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 45,
              width: '100%',
              justifyContent: 'space-between',
              paddingBottom: 20,
            }}
          >
            <PageTitleFlag style={{ marginLeft: 15, fontSize: 22 }}>Flag as inappropriate?</PageTitleFlag>
            <TouchableOpacity onPress={onPressButton} style={{ marginRight: 15 }}>
              {/* Change to: "Submit Report" */}
              <TextPostContent>Flag</TextPostContent>
            </TouchableOpacity>
          </View>

          {/* Section/Container for Anonymous Username */}
          <View style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}>
            <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }}>{user}</Text>
          </View>

          {/* Section/Container for Text in the Post/Comment to be reported */}
          <View style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}>
            <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }} numberOfLines={1}>
              {post}
            </Text>
          </View>

          {/* Section to separate Post/Comment data from Selectors */}
          <View style={{ backgroundColor: '#DADADA', paddingVertical: 15, borderTopColor: '#DADADA' }}>
            <Text style={{ marginLeft: 15, color: 'black', fontSize: 15 }}>"Other" Reasoning:</Text>
          </View>

          {/* Bottom line divider (styling purposes) */}
          <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} />
          {/* Text Input for "Other" reasoning */}

          <TextInput
            placeholder="Reasoning Here..."
            name="reportText"
            style={styles.input}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('reportText', e)} //update inputs to match user input
            value={reportText}
            selectionColor="#FFCC15" //implement a max length
            maxLength={250}
            multiline
          />

          <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} />
        </StyledViewPostContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReportModal;

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledPostInput {...props} />
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

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    width: '120%',
    borderColor: '#DEE2E6',
    borderTopWidth: 1,
    marginVertical: 1,
  },
  other: {
    paddingVertical: 20,
    borderWidth: 0,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 5,
    backgroundColor: 'white',
  },
});
