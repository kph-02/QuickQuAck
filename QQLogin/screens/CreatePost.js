import React, { useState, Component, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';
import Poll from '../components/Poll.js';
import * as Location from 'expo-location';

//icons

import { Octicons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
  RightIcon,
  Colors,
  TextLink,
  StyledPostInput,
  TextPostContent,
  PageTitleFlag,
  StyledViewPostScrollView,
  StyledButton,
  ButtonText,
} from './../components/styles';
import { 
  Button, 
  Image, 
  View, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TextInput, 
  Dimensions, 
  Keyboard, 
  TouchableWithoutFeedback, 
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import Map from '../screens/Map';
//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePost = ({ route, navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const [alertModal, setAlertModal] = useState(false);
  const { postType } = route.params;
  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    postText: '',
    postTag: [] /*Initialize as first value in tags drop-down*/,
    num_comments: 0 /*0 comments to begin with, updated when new comments added */,
    num_upvotes: 0,
    latitude: null,
    longitude: null,
  });

  var JWTtoken = '';

  //Used w/ Switch for Location
  const [isEnabled, setIsEnabled] = useState(false);

  //Used for activity indicator
  const [animated, setAnimation] = useState(false);

  //Stores values to update input fields from user
  const { postText, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });

    // console.log(inputs);
  };

  //Runs only when objects are rendered
  useEffect(() => {
    //If updating post, select tags already associated with the post
    if (postType.post_type === 'Update') {
      setSelectedItems(postType.tagarray);
    }
  }, []);

  // useEffect(() => {
  //   getLocationAsync();
  // } , []);

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.postText && inputs.postTag.length != 0) {
      sendToDB(postType.post_type, inputs);

      if (postType.post_type === 'Update') {
        navigation.navigate('TabNav', { Screen: 'Feed' });
        alert('Post Updated!');
      } else {
        navigation.pop();
        if (postType.post_type === 'Text') {
          alert('Post Created');
        } else {
          alert('Post not created, poll not setup yet');
        }
      }
    } else {
      alert('Can not submit a post without content or tags!');
    }
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

  //Send post information created by user to the database
  const sendToDB = async (type, body) => {
    await getJWT(); //get Token

    if (type === 'Text') {
      try {
        // console.log('Sent Token:      ' + JWTtoken);
        // Send post info to DB
        const response = await fetch('http://' + serverIp + '/feed/create-post', {
          method: 'POST',
          headers: { token: JWTtoken, 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();
        // console.log(postTag);
        // console.log(parseRes);
      } catch (error) {
        console.error(error.message);
      }
    }

    if (type === 'Update') {
      const updateBody = {
        postText: body.postText,
        post_id: postType.post_id,
        postTag: body.postTag,
      };

      try {
        // console.log('Sent Token:      ' + JWTtoken);
        // Send post info to DB
        const response = await fetch('http://' + serverIp + '/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken, 'content-type': 'application/json' },
          body: JSON.stringify(updateBody),
        });

        const parseRes = await response.json();

        //console.log('UPDATE: ' + JSON.stringify(parseRes));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const items = [
    //list of items for the select list
    { id: '{Revelle}', name: 'Revelle' },
    { id: '{Muir}', name: 'Muir' },
    { id: '{Marshall}', name: 'Marshall' },
    { id: '{Warren}', name: 'Warren' },
    { id: '{ERC}', name: 'ERC' },
    { id: '{Sixth}', name: 'Sixth' },
    { id: '{Seventh}', name: 'Seventh' },
    { id: '{Question}', name: 'Question' },
    { id: '{Poll}', name: 'Poll' },
    { id: '{Food}', name: 'Food' },
    { id: '{Social}', name: 'Social' },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    if (selectedItems.length > 3) {
      return;
    }
    setSelectedItems(selectedItems);
    setInputs({ ...inputs, postTag: selectedItems });
  };

  useEffect(() => {
    if (postType.post_type === 'Update') {
      onChange('postText', postType.post_text);
    }
  }, []);

  //Below functions/consts are from Settings.js, above are from Profile.js
  // const initialLocationState = {
  //   location: {
  //     latitude: 0,
  //     longitude: 0,
  //   },
  // };

  // const initialErrorMessage = {
  //   errorMessage: '',
  // };
  // const [locationPermission, setLocationPermission] = useState(initialLocationState);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMsg] = useState(null);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    setInputs({ ...inputs, latitude: location.coords.latitude, longitude: location.coords.longitude });
  };

  // useEffect(() => {
  //   console.log(inputs);
  // }, [inputs]);

  const toggleSwitch = () => {
    // setAnimation(true);
    if (isEnabled == false) {
      Alert.alert('Post to Map', "This will place a marker at your device's current location.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => boop() },
      ]);
    } else {
      setIsEnabled((previousState) => !previousState);
      setInputs({ ...inputs, latitude: null, longitude: null });
      // console.log(inputs);
    }
    const boop = () => {
      setIsEnabled((previousState) => !previousState);
      if (isEnabled == false) {
        getLocationAsync();
        handleModal();
        // setTimeout(() => {Alert.alert('Please Hold', "This will take a few seconds.", []), 3000);
        // console.log(inputs);
      }
    };
  };

  const handleModal = () => {
    setTimeout(() => {
      setAlertModal(true);
    }, 100);
    setTimeout(() => {
      setAlertModal(false);
    }, 6000);
  };
  // useEffect(() => {
  //   if (inputs.latitude) {
  //     setAnimation(true);
  //   }
  // }, [inputs.latitude]);

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop()}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <StyledViewPostContainer>
          <StatusBar style="black" />

          {/* Back Button */}
          <TextLink
            onPress={() => navigation.pop()}
            style={{ marginLeft: 10, width: 55, paddingHorizontal: 5, bottom: 20 }}
          >
            <TextPostContent>Back</TextPostContent>
          </TextLink>

          {/* Page Title with the Post/Update button across from it */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 35,
              width: '100%',
              justifyContent: 'space-between',
              paddingBottom: 20,
            }}
          >
            <PageTitleFlag style={{ marginLeft: 15, fontSize: 22 }}>
              {postType.post_type === 'Update' ? 'Update Post' : 'New Post'}
            </PageTitleFlag>
            <TouchableOpacity onPress={onPressButton} style={{ marginRight: 15 }}>
              <TextPostContent>{postType.post_type === 'Update' ? 'Update' : 'Post'}</TextPostContent>
            </TouchableOpacity>
          </View>
          {/* Switch to allow app to obtain poster's location for map */}
          <View style={styles.switchContainer}>
              <Text style={[{padding: 15, width: '85%', fontSize: 15}]}>Post to Map</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#FFCC15' }}
                thumbColor={isEnabled ? '#ffdd62' : '#f4f3f4'}
                style={{ width: '13%', transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
          </View>
          {/* Section/Container for Anonymous Username */}
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 10,
              // paddingTop: 10,
              borderTopColor: '#DADADA',
              borderTopWidth: 1,
              paddingHorizontal: 15,
            }}
          >
            <MultiSelect
              hideSubmitButton
              items={items}
              uniqueKey="name"
              // onSelectedItemsChange={(selectedItems) => onChange('postTag', selectedItems)} //update inputs to match user input
              selectedItems={selectedItems}
              onSelectedItemsChange={onSelectedItemsChange}
              // onToggleList = {console.log(moo)}
              selectedItemIconColor={yellow}
              selectedItemTextColor={black}
              tagBorderColor={yellow}
              tagTextColor={black}
              textInputProps={{ editable: false }}
              searchInputPlaceholderText=""
              searchIcon={false}
              styleListContainer={{ height: height * 0.22 }}
            />
            {/* <View style={styles.loading} pointerEvents="none">
            <ActivityIndicator
              color="#FFCC15"
              size="large"
              animating={animated}
              
            />
            </View> */}
            {/* <StyledButton onPress={() => console.log(inputs)}>
              <ButtonText>Location</ButtonText>
            </StyledButton> */}
          </View>
          <ScrollView
          keyboardShouldPersistTaps="handled">
          {/* Section/Container for Text input for the Post */}
          <View
            style={{
              // alignItems: 'stretch',
              backgroundColor: 'white',
              paddingBottom: height * 0.15,
              borderTopColor: '#DADADA',
              // borderTopWidth: 1,
            }}
          >
            <TextInput
              placeholder={postType.post_type === 'Text' ? 'Post Text' : (postType.post_type === 'Poll' ? 'Poll Title' : 'Update Post Text')}
              name="postText"
              style={styles.input}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChange('postText', e)} //update inputs to match user input
              value={postText}
              selectionColor="#FFCC15" //implement a max length
              maxLength={250}
              multiline
            />
            {/* <Poll Type={postType.post_type} /> */}
            {/* <Button
              title="test" 
            title="test" 
              title="test" 
              onPress= {() => console.log(Map.getLocationAsync())} /> */}
            </View>
          </ScrollView>
        </StyledViewPostContainer>
      </TouchableWithoutFeedback>
      <Modal animationType={'fade'} transparent={true} visible={alertModal}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000080',

          }}
        >
          <View
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              width: 300,
              height: 100,
              backgroundColor: '#fff',
              padding: 20,
            }}
          >
            <View style={styles.loading}>
              <Text style={styles.waitText}>Please wait...</Text>
              <ActivityIndicator size="large" color="#FFCC15" />
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

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

export default CreatePost;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopColor: '#DADADA',
    borderTopWidth: 1,
    width: '100%'
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
    // margin: 12,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#DADADA',
    borderBottomColor: '#DADADA',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    width: '75%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cdd2c9',
    backgroundColor: '#cdd2c9',


  },
  waitText: {
    textAlign: 'center', // <-- the magic
    fontSize: 18,
    
  }
});
