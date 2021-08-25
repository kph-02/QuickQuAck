import React, { useState, Component, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//formik
import { Formik, setIn } from 'formik';

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
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ScrollView,
} from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import { Picker } from '@react-native-picker/picker';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const FlagPost = ({ route, navigation }) => {
  // const { post_id, post_text } = post;

  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const [modalOpen2, setModalOpen2] = useState(false);

  const { post, user, postid, comment_owner } = route.params;

  //Hooks and initial states for the Selectors
  const [checkboxState, setCheckboxState] = useState([
    { label: 'Bullying / Harassment', value: 'harassment', checked: false },
    { label: 'Inappropriate Content', value: 'inappropriate', checked: false },
    { label: 'Discrimination / Hate Speech', value: 'hate', checked: false },
    { label: 'Invasion of Privacy', value: 'privacy', checked: false },
    { label: 'Trolling', value: 'trolling', checked: false },
    { label: 'Spam', value: 'spam', checked: false },
    // { label: 'Other', value: 'other', checked: false },
  ]);

  //Getting user input
  const [inputs, setInputs] = useState({
    checkboxState: '',
    reportText: '',
  });

  const { reportText } = inputs;

  var JWTtoken = '';

  const goBackModal = async () => {
    setModalOpen2(false);
    setModalOpen(true);
    clearState();
  };

  const handleModal2 = async () => {
    setModalOpen2(true);
    clearState();
  };
  const initialState = {
    checkboxState: '',
    reportText: '',
  };

  const clearState = () => {
    setInputs({ ...initialState });
  };

  //Stores values to update input fields from user
  //const { postTitle, postText, author_id, postTag } = inputs;
  // const { postText, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
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
    body.poster_id = user;
    body.post_text = post;
    body.post_id = postid;
    body.comment_owner = comment_owner;
    // const body = { posterID: user, post_text: post, post_id: postid };
    // console.log(body);
    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + '/feed/flag-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      // const parseRes = await response.json();

      // console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    // console.log('This is logging the value of test3');
    // console.log(checkboxState);
    const checkboxObjectArray = checkboxState.filter((o) => o.checked === true);
    // console.log(checkboxObject);
    if (checkboxObjectArray.length) {
      const checkboxObject = checkboxObjectArray[0];
      var test3 = checkboxObject.label;
      console.log(test3);
      setInputs({ checkboxState: test3 });
      // console.log('This is logging the value of inputs');
      // console.log(inputs.checkboxState);
    }
  }, [checkboxState]);

  // useEffect(() => {
  //   // console.log(inputs.checkboxState)
  //   sendToDB(inputs);
  // }, [inputs]);

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault();
    // console.log(inputs);
    sendToDB(inputs);
    navigation.pop()
  };

  // Function to handle the checked state of Selectors
  const selectorHandler = (value, index) => {
    const newValue = checkboxState.map((selector, i) => {
      if (i !== index)
        return {
          ...selector,
          checked: false,
        };
      if (i === index) {
        const item = {
          ...selector,
          checked: !selector.checked,
        };
        return item;
      }
      return selector;
    });
    setCheckboxState(newValue);
  };

  return (
    <View>
      <Modal
        transparent={true}
        statusBarTranslucent={false}
        visible={modalOpen}
        animationType="slide"
        onRequestClose={() => navigation.pop()}
      >
        <StyledViewPostContainer>
          <StatusBar style="black" />

          {/* Back Button */}
          <TextLink onPress={() => navigation.pop()} style={{ marginLeft: 10, width: 55, paddingHorizontal: 5 }}>
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
            <Text style={{ marginLeft: 15, color: 'black', fontSize: 15 }}>This post falls under:</Text>
          </View>
          <ScrollView>
          {/* Renders the different Flag Selection Choices (selectors/checkboxes) */}
          {checkboxState.map((selector, i) => (
            <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} key={i}>
              <CheckBox
                onPress={() => selectorHandler(true, i)}
                title={selector.label}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={selector.checked}
                checkedColor={'#FFCC15'}
                containerStyle={{backgroundColor: 'white', paddingVertical: 14, borderWidth: 0, borderColor: 'white' }}
                textStyle={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}
              />
            </View>
          ))}

          {/* Bottom line divider (styling purposes) */}
          <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} />
          {/* "Other" option to report post */}
          <TouchableOpacity style={[styles.other]} onPress={() => handleModal2()}>
            <Text style={{ fontSize: 15, marginLeft: width * 0.05 }}>Other:</Text>
            <AntDesign
              name="right"
              size={20}
              color="#BDBDBD"
              style={{ paddingHorizontal: 10, marginRight: width * 0.05 }}
            />
          </TouchableOpacity>
          <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} />
          </ScrollView>
        </StyledViewPostContainer>
      </Modal>

      <Modal
        transparent={true}
        statusBarTranslucent={false}
        visible={modalOpen2}
        animationType="slide"
        onRequestClose={() => goBackModal()}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <StyledViewPostContainer>
            <StatusBar style="black" />

            {/* Back Button */}
            {/* Using navigation.pop(2) for now, because popping back to the FlagPost modal causes issues */}
            <TextLink onPress={() => goBackModal()} style={{ marginLeft: 10, width: 55, paddingHorizontal: 5 }}>
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
            <View
              style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}
            >
              <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }}>{user}</Text>
            </View>

            {/* Section/Container for Text in the Post/Comment to be reported */}
            <View
              style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}
            >
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
    </View>
  );
};

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

export default FlagPost;

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
    // height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  thingy: {
    backgroundColor: 'white',
    borderTopColor: '#DADADA',
    borderTopWidth: 1,
  },
});
