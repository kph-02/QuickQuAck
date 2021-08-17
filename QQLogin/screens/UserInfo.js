import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverIp } from './Login.js';

import { useFocusEffect } from '@react-navigation/native';
//formik
import { Formik } from 'formik';

import { Colors, StyledPostInput, StyledButton, ButtonText } from './../components/styles';

import { Button, View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
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

const UserInfo = ({ navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [modalOpen2, setModalOpen2] = useState(false);
  const handleModal2 = () => {
    setModalOpen2(!modalOpen2);
  };

  const [modalOpen3, setModalOpen3] = useState(false);
  const handleModal3 = () => {
    setModalOpen3(!modalOpen3);
  };

  const [modalOpen4, setModalOpen4] = useState(false);
  const handleModal4 = () => {
    setModalOpen4(!modalOpen4);
  };

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    college: '',
    gy: '',
  });

  const { firstName, lastName, email, password, college, gy } = inputs;

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

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      console.log(inputs);
      // Update server with user's  information
      const response = await fetch('http://' + serverIp + ':5000/feed/edit-user-info', {
        method: 'PUT',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      // const parseRes = await response.json();

      // console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    console.log(inputs);
  };

  //Executes when Submit is pressed, sends  information to the database
  const onPressButtonName = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.firstName && inputs.lastName) {
      sendToDB(inputs);
      navigation.pop();
    } else {
      alert('Please enter your first and last name.');
    }
  };

  //Executes when Submit is pressed, sends  information to the database
  const onPressButtonEmail = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.email) {
      sendToDB(inputs);
      navigation.pop();
    } else {
      alert('Please enter your new email.');
    }
  };

  const onPressButtonPassword = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.password) {
      sendToDB(inputs);
      navigation.pop();
    } else {
      alert('Please enter your new password.');
    }
  };

  const onPressButtonSchool = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.gy && inputs.college) {
      sendToDB(inputs);
      navigation.pop();
    } else {
      alert('Please enter your school information.');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        style={{ margin: 0 }}
        coverScreen={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modalOpen}
        onBackButtonPress={handleModal}
      >
        <View style={styles.modalBodyContent}>
          {/* <TextInput style={styles.input} onChangeText={onChangeFirstName} value={firstName} />
          <TextInput style={styles.input} onChangeText={onChangeLastName} value={lastName} /> */}
          <Text style={styles.welcome}>
            Please enter your first and last name. This information will not be shown anywhere unless you choose to show
            it.
          </Text>

          <MyTextInput
            placeholder="First Name"
            name="firstName"
            // style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('firstName', e)} //update inputs to match user input
            value={firstName}
            selectionColor="#FFCC15" //implement a max length
          />
          <MyTextInput
            placeholder="Last Name"
            name="lastName"
            style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('lastName', e)} //update inputs to match user input
            value={lastName}
            selectionColor="#FFCC15"
          />
          <StyledButton onPress={onPressButtonName}>
            <ButtonText>Change Name</ButtonText>
          </StyledButton>
        </View>
      </Modal>

      <Modal
        style={{ margin: 0 }}
        coverScreen={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modalOpen2}
        onBackButtonPress={handleModal2}
      >
        <View style={styles.modalBodyContent}>
          {/* <TextInput style={styles.input} onChangeText={onChangeFirstName} value={firstName} />
          <TextInput style={styles.input} onChangeText={onChangeLastName} value={lastName} /> */}
          <Text style={styles.welcome}>Please enter a new email.</Text>

          <MyTextInput
            placeholder="New Email"
            name="email"
            style={{ borderBottomWidth: 10 }}
            // style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('email', e)} //update inputs to match user input
            value={email}
            selectionColor="#FFCC15" //implement a max length
          />
          <StyledButton onPress={onPressButtonEmail}>
            <ButtonText>Change Email</ButtonText>
          </StyledButton>
        </View>
      </Modal>

      <Modal
        style={{ margin: 0 }}
        coverScreen={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modalOpen3}
        onBackButtonPress={handleModal3}
      >
        <View style={styles.modalBodyContent}>
          <Text style={styles.welcome}>Please enter a new password.</Text>
          <MyTextInput
            placeholder="New Password"
            name="password"
            // style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('password', e)} //update inputs to match user input
            value={password}
            selectionColor="#FFCC15" //implement a max length
          />
          <StyledButton onPress={onPressButtonPassword}>
            <ButtonText>Change Password</ButtonText>
          </StyledButton>
        </View>
      </Modal>

      <Modal
        style={{ margin: 0 }}
        coverScreen={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modalOpen4}
        onBackButtonPress={handleModal4}
      >
        <View style={styles.modalBodyContent}>
          {/* <TextInput style={styles.input} onChangeText={onChangeFirstName} value={firstName} />
          <TextInput style={styles.input} onChangeText={onChangeLastName} value={lastName} /> */}
          <Text style={styles.welcome}>
            Change information about your school here. This information will not be shown anywhere unless you choose to
            show it.
          </Text>
          <MyTextInput
            placeholder="College"
            name="college"
            // style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('college', e)} //update inputs to match user input
            value={college}
            selectionColor="#FFCC15" //implement a max length
          />
          <MyTextInput
            placeholder="Grad Year"
            name="gy"
            style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }}
            placeholderTextColor={darkgray}
            onChangeText={(e) => onChange('gy', e)} //update inputs to match user input
            value={gy}
            selectionColor="#FFCC15"
          />
          <StyledButton onPress={handleModal4}>
            <ButtonText>Change School Information</ButtonText>
          </StyledButton>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TouchableOpacity style={{ marginRight: 15, width: 50, paddingTop: 70 }} onPress={() => navigation.pop()}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headline}>My Account</Text>
        </View>
      </View>
      {/* for display only */}

      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={handleModal}>
            <Text style={{ marginLeft: 15, fontSize: 13 }}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={handleModal2}>
            <Text style={{ marginLeft: 15, fontSize: 13 }}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={handleModal3}>
            <Text style={{ marginLeft: 15, fontSize: 13 }}>Password</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={handleModal4}>
            <Text style={{ marginLeft: 15, fontSize: 13 }}>School</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: 40,
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.darkgray,
    backgroundColor: '#FFFFFF',
  },
  modalBodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '120%',
    borderTopColor: '#DEE2E6',
    borderTopWidth: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    height: 100,
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 50,
    marginRight: 75,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      {/* <StyledInputLabel> {label} </StyledInputLabel> */}
      <StyledPostInput
        {...props}
        style={{ maxHeight: 150, padding: 0, marginVertical: 0, borderRadius: 0, marginBottom: 0 }}
      />
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
export default UserInfo;
